import React from 'react';
import {
  Table,
  Form,
  Dropdown,
  Menu,
  Button,
  Modal,
  Input,
  Select,
  message,
} from 'antd';

import { EditBookWapper } from './EditBook.style';
import ModalNormalization from './ModalNormalization';
import axios from 'axios';
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
//lấy chỉ số select bảng
const dataSelected = [];
const rowSelection = {
  onChange: selectedRows => {
    return dataSelected.push(selectedRows);
  },
};

class TableBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      visibleAddChapter: false,
      editVisible: false,
      dataTable: [],
      objChapters: {},
      chapters: [],
      keyModal: null,
      loading: false,
    }; // visible modal Edit
  }
  componentDidMount() {
    const { bookId } = this.props;
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters`,
      withCredentials: true,
    }).then(response => {
      if (response.status) {
        const chapters = response.data.results;
        const dataTable = chapters.map(chapter => {
          return {
            key: `${chapter.id}`,
            title: `${chapter.title}`,
            content: `${chapter.content}`,
            orderNo: chapter.orderNo,
          };
        });

        this.setState({ dataTable: dataTable, chapters: chapters }, function() {
          this.convertChapters();
        });
      }
    });
  }

  convertChapters = () => {
    const { chapters } = this.state;
    const objChapters = {};
    chapters.forEach(chapter => {
      objChapters[chapter.id] = chapter;
    });
    this.setState({ objChapters });
  };
  //Xóa 1 phần tử
  handleDelete = key => {
    //key chính là chapterID
    const { bookId } = this.props;
    axios({
      method: 'DELETE',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters/${key}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(res => {
      if (res.status) {
        const dataTable = [...this.state.dataTable];
        this.setState({
          dataTable: dataTable.filter(item => item.key !== key),
        });
        message.success('Xóa chương thành công!');
      }
    });
  };
  // Xóa lựa chọn nhiều
  handleDeleteTable = () => {
    const { bookId } = this.props;
    const lastIndex = dataSelected.length - 1;
    const arrayNumberSelected = dataSelected[lastIndex];
    // const { dataTable } = this.state;
    // const listId = [];
    // for (let i in arrayNumberSelected) {
    //   for (let j in dataTable) {
    //     if (dataTable[j].orderNo === arrayNumberSelected[i]) {
    //       listId.push(dataTable[j].key);
    //     }
    //   }
    // }
    axios({
      method: 'DELETE',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters/`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: arrayNumberSelected,
    }).then(res => {
      if (res.status) {
        message.success('Xóa chương thành công!');
        window.location.reload();
      }
    });
  };
  // Thêm chương trong Detail Book

  handleCancel = () => {
    this.setState({
      editVisible: false,
      loading: false,
      visibleAddChapter: false,
    });
  };

  handleAddChapter = visibleAddChapter => {
    this.props.form.setFieldsValue({
      modalTitleAdd: '',
      modalContentAdd: '',
    });
    this.setState({
      visibleAddChapter,
    });
  };
  handleSaveAddChapter = () => {
    const { bookId } = this.props;
    const { dataTable } = this.state;
    if (dataTable.length > 0) {
      const lastIndex = dataTable.length - 1;
      const chapterOrderNo = dataTable[lastIndex].orderNo;
      this.setState({ loading: true });
      this.props.form.validateFields((err, fieldsValue) => {
        if (!err) {
          axios({
            method: 'POST',
            url: `http://localhost:8080/api/v1/books/${bookId}/chapters`,
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            data: {
              title: fieldsValue['modalTitleAdd'],
              content: fieldsValue['modalContentAdd'],
              orderNo: chapterOrderNo + 1,
            },
          }).then(res => {
            if (res.data.status === 0) {
              message.error('Thêm chương có orderNo đã tồn tại!!');
            } else {
              this.setState({
                visibleAddChapter: false,
                loading: false,
              });
              message.success('Thêm chương thành công !');
              window.location.reload();
            }
          });
        }
      });
    } else {
      this.setState({ loading: true });
      this.props.form.validateFields((err, fieldsValue) => {
        if (!err) {
          axios({
            method: 'POST',
            url: `http://localhost:8080/api/v1/books/${bookId}/chapters`,
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            data: {
              title: fieldsValue['modalTitleAdd'],
              content: fieldsValue['modalContentAdd'],
              orderNo: 1,
            },
          }).then(res => {
            if (res.data.status === 0) {
              message.error('Thêm chương có orderNo đã tồn tại!!');
            } else {
              this.setState({
                visibleAddChapter: false,
                loading: false,
              });
              message.success('Thêm chương thành công !');
              window.location.reload();
            }
          });
        }
      });
    }
  };
  // Hiện modal Edit

  // handleSynthensis = () => {
  //   console.log('Quản lý tổng hợp');
  // };
  handleEdit = key => {
    const { objChapters } = this.state;
    this.props.form.setFieldsValue({
      modalTitleEdit: objChapters[key].title,
      modalContentEdit: objChapters[key].content,
    });
    this.setState({ editVisible: true, keyModal: key, loading: true });
  };
  handleSave = () => {
    const { keyModal, objChapters } = this.state;
    const { bookId } = this.props;
    const chapterId = objChapters[keyModal].id;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        axios({
          method: 'PUT',
          url: `http://localhost:8080/api/v1/books/${bookId}/chapters/${chapterId}`,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            title: fieldsValue['modalTitleEdit'],
            content: fieldsValue['modalContentEdit'],
          },
        }).then(res => {
          if (res.status) {
            const { dataTable } = this.state;
            message.success('Sửa chương thành công !!');
            setTimeout(() => {
              this.setState(
                {
                  editVisible: false,
                  dataTable: dataTable.map(item => {
                    if (item.key !== keyModal) return item;
                    return {
                      ...item,
                      title: fieldsValue['modalTitleEdit'],
                      content: fieldsValue['modalContentEdit'],
                    };
                  }),
                  loading: false,
                },
                function() {
                  this.updateObjChapters();
                },
              );
            }, 200);
          }
        });
      }
    });
  };

  updateObjChapters = () => {
    const { dataTable } = this.state;
    const objChapters = {};
    dataTable.map(data => {
      objChapters[data.key] = data;
    });
    this.setState({
      objChapters: objChapters,
    });
  };

  // Modal Chuẩn hóa
  setNormalizationVisible = key => {
    const { objChapters } = this.state;
    this.setState({
      dataChapterNormalization: objChapters[key].normalizationValue,
      dataNormalization: objChapters[key],
      visibleNormalization: true,
    });
  };
  closeModal = visible => {
    this.setState({
      visibleNormalization: visible,
    });
  };
  render() {
    const columns = [
      { title: 'Chương', dataIndex: 'title', key: 'title', width: '80%' },
      {
        title: 'Lựa chọn',
        key: 'choice',
        width: '20%',
        render: record => {
          if (this.state.dataTable.length >= 1) {
            const menu = (
              <Menu>
                <Menu.Item>
                  <a>Tổng hợp</a>
                </Menu.Item>
                <Menu.Item>
                  <a>Chuẩn hóa</a>
                </Menu.Item>
                <Menu.Item onClick={() => this.handleDelete(record.key)}>
                  <a>Xóa</a>
                </Menu.Item>
                <Menu.Item
                  onClick={() => this.setNormalizationVisible(record.key)}
                >
                  <a>Kiểm tra</a>
                </Menu.Item>
              </Menu>
            );
            return (
              <Dropdown.Button
                style={{ color: '#505659' }}
                onClick={() => this.handleEdit(record.key)}
                overlay={menu}
              >
                Chỉnh sửa
              </Dropdown.Button>
            );
          } else {
            return;
          }
        },
      },
    ];
    const { getFieldDecorator } = this.props.form;
    return (
      <EditBookWapper>
        {/* Bảng thông tin chapter và lựa chọn hành động cho bảng */}
        <Select
          className="selectact"
          showSearch
          style={{ width: 120 }}
          placeholder="Hành động"
        >
          <Option
            value="addchapter"
            onClick={() => this.handleAddChapter(true)}
          >
            Thêm chương
          </Option>
          <Option value="synthesis">Tổng hợp</Option>
          <Option value="normalization">Chuẩn hóa</Option>
          <Option value="delete" onClick={this.handleDeleteTable}>
            Xóa
          </Option>
        </Select>
        <div className="table-chapter">
          <Table
            bordered
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.state.dataTable}
            loading={this.state.loading}
            rowKey={record => record.key}
          />
        </div>
        {/* Modal Add  chương */}
        <div className="modal-add-chapter">
          <Modal
            visible={this.state.visibleAddChapter}
            title="Thêm chương"
            okText="Thêm"
            cancelText="Hủy"
            onCancel={this.handleCancel}
            width={900}
            onOk={this.handleSaveAddChapter}
          >
            <Form layout="vertical">
              <FormItem label="Tiêu đề">
                {getFieldDecorator('modalTitleAdd', {
                  rules: [
                    {
                      required: false,
                      message: 'Tên tiêu đề không được để trống!!',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="Nội dung">
                {getFieldDecorator('modalContentAdd')(<TextArea rows={16} />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
        {/* Modal Edit chương */}
        <Modal
          visible={this.state.editVisible}
          title="Sửa chương"
          onOk={this.handleSave}
          okText="Lưu"
          onCancel={this.handleCancel}
          cancelText="Hủy"
          width={900}
        >
          <Form layout="vertical">
            <FormItem label="Tiêu đề">
              {getFieldDecorator('modalTitleEdit', {
                rules: [
                  {
                    required: false,
                    message: 'Tên tiêu đề không được để trống!!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Nội dung">
              {getFieldDecorator('modalContentEdit')(<TextArea rows={16} />)}
            </FormItem>
          </Form>
        </Modal>
        {/* Modal chuẩn hóa nội dung */}
        <div className="modal-normalization">
          <ModalNormalization
            visible={this.state.visibleNormalization}
            dataChapterNormalization={this.state.dataChapterNormalization}
            dataNormalization={this.state.dataNormalization}
            closeModal={this.closeModal}
          />
        </div>
      </EditBookWapper>
    );
  }
}

const TableChapter = Form.create()(TableBook);

export default TableChapter;
