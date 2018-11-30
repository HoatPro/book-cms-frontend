import React from 'react';
import { AddbookUIStyle } from './AddBookUI.style';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Breadcrumb,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Icon,
  Upload,
  message,
  InputNumber,
  Dropdown,
  Menu,
  Table,
  Tooltip,
  Modal,
} from 'antd';

// import TableUploadBook from './TableUploadBook';
//Modal Add and Modal Edit

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
// rowSelection chọn phần tử trong bảng
const dataSelected = [];
const rowSelection = {
  onChange: selectedRows => {
    return dataSelected.push(selectedRows);
  },
};
class AddBookUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoCompleteResult: [],
      loading: false,
      disableButton: true, // disable button 'Thêm sách'
      disaleButtonAdd: false, // disable button 'Thêm chương' nếu chọn Upload
      showTable1: true, // bảng thêm chapter bằng tay
      addVisible: false, // visible modal Add
      editVisible: false, // visible modal Edit
      chapters: [], // lưu trữ chapter của bảng
      // fileName: '',
      keyModal: null,
      dataCategory: [],
      dataAuthor: [],
    };
  }

  getColumns = () => {
    const columns = [
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        width: '80%',
      },
      {
        title: 'Lựa chọn',
        key: 'operation',
        width: '20%',
        render: (text, record) => {
          if (this.state.chapters.length >= 1)
            return (
              <div>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => this.handleEdit(record.orderNo)}
                      >
                        <a>Chỉnh sửa</a>
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => this.handleDelete(record.orderNo)}
                      >
                        <a>Xóa</a>
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button>
                    <Icon type="down" theme="outlined" />
                    Hành động
                  </Button>
                </Dropdown>
              </div>
            );
        },
      },
    ];
    return columns;
  };
  async componentDidMount() {
    //API dữ liệu thể loại
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/categories?fileds=name`,
      withCredentials: true,
    }).then(res => {
      const dataCategory = res.data.results.items;
      this.setState({
        dataCategory: dataCategory,
      });
    });

    //API dữ liệu tác giả
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/authors?fileds=name`,
      withCredentials: true,
    }).then(res => {
      const dataAuthor = res.data.results.items;
      this.setState({ dataAuthor: dataAuthor });
    });
  }
  // Submit form
  handleSubmit = e => {
    e.preventDefault();
    let { chapters } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
      }
      //API POST BOOK BY UI
      chapters = chapters.map(chapter => {
        return {
          ...chapter,
          orderNo: chapter.orderNo,
        };
      });
      if (
        !fieldsValue['authors'] ||
        !fieldsValue['categories'] ||
        !fieldsValue['month_picker']
      ) {
        axios({
          method: 'POST',
          url: 'http://localhost:8080/api/v1/books/',
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            title: fieldsValue['title'],
            publishingCompany: fieldsValue['publishingCompany'],
            translator: fieldsValue['translator'],
            pageNumber: fieldsValue['pageNumber'],
            // fileName: fileName,
            chapters: chapters,
          },
        }).then(res => {
          if (res.status === 200 && res.data.status) {
            let path = '/manager-book';
            this.props.history.push(path);
          } else {
            alert('Upload sách lỗi');
          }
        });
      } else {
        const categories = fieldsValue['categories'].map(category => {
          const start = category.lastIndexOf('-') + 1;
          const str = category.slice(start);
          return {
            id: str,
          };
        });
        const authors = fieldsValue['authors'].map(author => {
          const start = author.lastIndexOf('-') + 1;
          const str = author.slice(start);
          return {
            id: str,
          };
        });
        axios({
          method: 'POST',
          url: 'http://localhost:8080/api/v1/books/',
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            title: fieldsValue['title'],
            publishingCompany: fieldsValue['publishingCompany'],
            translator: fieldsValue['translator'],
            categories: categories,
            authors: authors,
            publicYear: fieldsValue['month_picker'].format('YYYY'),
            pageNumber: fieldsValue['pageNumber'],
            // fileName: fileName,
            chapters: chapters,
          },
        }).then(res => {
          if (res.status === 200 && res.data.status) {
            let path = '/manager-book';
            this.props.history.push(path);
          } else {
            alert('Upload sách lỗi');
          }
        });
      }
    });
  };

  //Function Modal
  showModal = () => {
    this.setState({
      showTable1: true,
    });
  };

  handleCancel = () => {
    this.setState({ addVisible: false, editVisible: false });
  };
  //Thêm chương bằng UI

  handleAdd = addVisible => {
    this.props.form.setFieldsValue({
      modalTitleAdd: '',
      modalContentAdd: '',
    });
    this.setState({
      addVisible,
      showTable1: true,
    });
  };
  handleSaveAdd = () => {
    const { chapters } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
      }
      //kiểm tra
      if (chapters.length < 1) {
        const newData = {
          title: fieldsValue['modalTitleAdd'],
          content: fieldsValue['modalContentAdd'],
          orderNo: 1,
        };
        this.setState({
          chapters: [...chapters, newData],
          addVisible: false,
          showTable1: true,
          disableButton: false,
        });
      } else {
        const lastIndexChapters = chapters.length - 1;
        const newData = {
          title: fieldsValue['modalTitleAdd'],
          content: fieldsValue['modalContentAdd'],
          orderNo: chapters[lastIndexChapters].orderNo + 1,
        };
        this.setState({
          chapters: [...chapters, newData],
          addVisible: false,
          showTable1: true,
          disableButton: false,
        });
      }
    });
  };

  //Sửa chương
  setEditVisible(editVisible) {
    this.setState({ editVisible });
  }
  handleEdit = orderNo => {
    const chapters = [...this.state.chapters];
    const chapter = chapters.filter(item => item.orderNo === orderNo);
    this.props.form.setFieldsValue({
      modalTitleEdit: chapter[0].title,
      modalContentEdit: chapter[0].content,
    });

    this.setState({ editVisible: true, keyModal: orderNo });
  };
  handleSave = () => {
    const { keyModal, chapters } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      this.setState({
        chapters: chapters.map(item => {
          if (item.orderNo !== keyModal) return item;
          return {
            ...item,
            title: fieldsValue['modalTitleEdit'],
            content: fieldsValue['modalContentEdit'],
          };
        }),
        editVisible: false,
      });
      message.success('Sửa chương thành công !!');
    });
  };
  //Xóa chương
  handleDelete = orderNo => {
    const chapters = [...this.state.chapters];
    this.setState({
      chapters: chapters.filter(item => item.orderNo !== orderNo),
    });
  };
  //Lựa chọn xóa nhiều chương
  handleDeleteAll = () => {
    const lastIndex = dataSelected.length - 1;
    const selected = dataSelected[lastIndex];
    const { chapters } = this.state;
    let chaptersNew = [...chapters];
    const arrayIndex = [];
    chapters.map((chapter, index) => {
      selected.map(select => {
        if (select === chapter.orderNo) {
          arrayIndex.push(index);
        }
      });
    });
    //Xóa các phần tử đã lựa chọn
    for (let i = arrayIndex.length - 1; i >= 0; i--) {
      chaptersNew.splice(arrayIndex[i], 1);
    }
    this.setState({
      chapters: chaptersNew,
    });
  };
  //Function click button Upload ,change TableUploadBook ,disable button 'Thêm chương' with dataUpload callback is text
  handleClickTable = () => {
    this.setState({
      showTable1: false,
      showTable2: true,
      disaleButtonAdd: true,
    });
  };
  //API upload book

  render() {
    const { chapters } = this.state;
    console.log([...chapters]);
    const { disableButton, disaleButtonAdd, showTable1 } = this.state;
    const props = {
      name: 'file',
      multiple: true,
      accept: '.DOCX, .DOC, .TXT',
      disabled: false,
      showUploadList: false,
      withCredentials: true,
      action: 'http://localhost:8080/api/v1/books/upload-book-content',
      onChange: info => {
        const { chapters } = this.state;
        const { status } = info.file;
        if (status === 'done') {
          const { response } = info.file;
          if (response.status === 1) {
            if (chapters.length < 1) {
              const dataUpload = response.results.chapters;
              this.setState({
                chapters: dataUpload.map(chapter => {
                  return { ...chapter, orderNo: chapter.orderNo };
                }),
                // fileName: info.file.name,
                disableButton: false,
              });
              message.success(`File ${info.file.name} upload thành công !`);
            } else {
              const lastIndexChapters = chapters.length - 1;
              const dataUpload = response.results.chapters;
              this.setState({
                chapters: [
                  ...chapters,
                  ...dataUpload.map(chapter => {
                    return {
                      ...chapter,
                      orderNo:
                        chapter.orderNo + chapters[lastIndexChapters].orderNo,
                    };
                  }),
                ],
                // fileName: info.file.name,
                disableButton: false,
              });
              message.success(`File ${info.file.name} upload thành công !`);
            }
          } else {
            message.warning('Upload không đúng định dạng file!!');
          }
        } else if (status === 'error') {
          message.error(`File ${info.file.name}  upload thất bại !!`);
        }
      },
    };

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    let table;
    if (showTable1) {
      table = (
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.state.chapters}
          columns={this.getColumns()}
          rowSelection={rowSelection}
          rowKey={record => record.orderNo}
        />
      );
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={this.handleDeleteAll}>Xóa</a>
        </Menu.Item>
      </Menu>
    );
    const { dataCategory } = this.state;
    const selectCategory = [];
    dataCategory.map(data => {
      selectCategory.push(
        <Option key={data.id} value={data.slug}>
          {data.name}
        </Option>,
      );
    });
    const { dataAuthor } = this.state;
    const selectAuthor = [];
    dataAuthor.map(data => {
      selectAuthor.push(
        <Option key={data.id} value={data.slug}>
          {data.name}
        </Option>,
      );
    });
    return (
      <AddbookUIStyle>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/manager-book">Quản lý sách</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/addbookui">Thêm sách bằng giao diện</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form chapters={this.state.chapters}>
          <div className="form_add_infobook">
            <FormItem {...formItemLayout} label="Tên sách">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Khi thêm sách, tên sách không được để trống!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Nhà xuất bản">
              {getFieldDecorator('publishingCompany', {
                rules: [
                  {
                    required: false,
                    message: 'Điền tên nhà xuất bản sách!',
                  },
                ],
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Năm xuất bản">
              {getFieldDecorator('month_picker', {
                rules: [
                  {
                    type: 'object',
                    required: false,
                    message: 'Chọn năm tháng xuất bản !',
                  },
                ],
              })(
                <MonthPicker
                  placeholder="Chọn năm, tháng xuất bản"
                  className="pick_time_puslish"
                  format="MM-YYYY"
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Người dịch">
              {getFieldDecorator('translator', {
                rules: [
                  {
                    required: false,
                    message: 'Điền tên người dịch !',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Tác giả&nbsp;
                  <Tooltip
                    title="Nhập tên tác giả và enter, với  những tên không nằm trong danh sách gợi ý sẽ được thêm mới"
                    className="tooltip"
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('authors', {
                rules: [
                  {
                    required: false,
                    message: 'Điền tên tác giả của sách!',
                  },
                ],
              })(
                <Select mode="tags" placeholder="Tên tác giả" allowClear={true}>
                  {selectAuthor}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Số trang">
              {getFieldDecorator('pageNumber', {
                rules: [
                  {
                    required: false,
                    message: 'Số trang sách hiện tại.',
                  },
                ],
              })(<InputNumber className="number_page" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Thể loại&nbsp;
                  <Tooltip
                    title="Nhập tên thể loại và enter"
                    className="tooltip"
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('categories', {
                rules: [
                  {
                    required: false,
                    message: 'Điền thể loại sách !',
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder="Chọn thể loại"
                  allowClear={true}
                >
                  {selectCategory}
                </Select>,
              )}
            </FormItem>
          </div>
          <hr />
          <div className="action-add-book">
            <Button
              type="primary"
              className="add_chapter"
              onClick={() => this.handleAdd(true)}
              disabled={disaleButtonAdd}
            >
              <Icon type="plus-circle" theme="outlined" />
              Thêm chương
            </Button>
            {/* Modal Add book */}
            <Modal
              visible={this.state.addVisible}
              chapters={this.state.chapters}
              onCancel={this.handleCancel}
              onOk={this.handleSaveAdd}
              title="Thêm chương"
              okText="Thêm"
              cancelText="Hủy"
              width={900}
            >
              <Form layout="vertical">
                <FormItem label="Tiêu đề">
                  {getFieldDecorator('modalTitleAdd')(<Input />)}
                </FormItem>
                <FormItem label="Nội dung">
                  {getFieldDecorator('modalContentAdd')(<TextArea rows={16} />)}
                </FormItem>
              </Form>
            </Modal>
            {/* Modal Edit Book */}
            <Modal
              visible={this.state.editVisible}
              chapters={this.state.chapters}
              onCancel={this.handleCancel}
              onOk={this.handleSave}
              title="Sửa chương"
              okText="Lưu"
              cancelText="Hủy"
              width={900}
            >
              <Form layout="vertical">
                <FormItem label="Tiêu đề">
                  {getFieldDecorator('modalTitleEdit')(<Input />)}
                </FormItem>
                <FormItem label="Nội dung">
                  {getFieldDecorator('modalContentEdit')(
                    <TextArea rows={16} />,
                  )}
                </FormItem>
              </Form>
            </Modal>
            <Upload
              {...props}
              showUploadList={false}
              className="upload_chapter"
            >
              <Button>
                <Icon type="upload" /> Tải lên
              </Button>
            </Upload>
            <hr />
            <Dropdown
              overlay={menu}
              trigger={['click']}
              className="dropdown-action"
            >
              <Button>
                Hành động
                <Icon type="down" />
              </Button>
            </Dropdown>
            {/* Table */}
            {table}
          </div>
          <Button
            className="addbook"
            type="primary"
            onClick={this.handleSubmit}
            disabled={disableButton}
          >
            Thêm sách
          </Button>
        </Form>
      </AddbookUIStyle>
    );
  }
}
const AddBook = Form.create()(AddBookUI);

export default AddBook;
