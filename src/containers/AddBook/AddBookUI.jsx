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
import ModalAdd from './ModalAdd';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
// rowSelection chọn phần tử trong bảng
const dataz = [];
const rowSelection = {
  onChange: selectedRows => {
    return dataz.push(selectedRows);
  },
};

//Tên tác giả
const authorsTag = [];
authorsTag.push(
  <Option key="5b97800a911f176704c41f6b">sharon l.lechter</Option>,
  <Option key="5b97800a911f176704c41f6d">robert t. kiyosaki</Option>,
  <Option key="5b97800a911f176704c41f6f">michael ellsberg</Option>,
  <Option key="5b97800a911f176704c41f71">jeffrey pfeffer</Option>,
  <Option key="5b97800a911f176704c41f74">geoffrey g. parker</Option>,
  <Option key="5bcd8309d91f1a2628f15e22">Nguyễn Nhật Ánh</Option>,
  <Option key="5bcd837fd91f1a2628f15e25">Nguyễn Ngọc Thạch</Option>,
  <Option key="5bcd8421d91f1a2628f15e26">Thần Đồng</Option>,
  <Option key="5bcd8464d91f1a2628f15e27">Trương Kiêt</Option>,
);
// Creat Form Modal
class AddBookUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoCompleteResult: [],
      selectedRowKeys: [],
      loading: false,
      authorsTag: [],
      disableButton: true, // disable button 'Thêm sách'
      disaleButtonAdd: false, // disable button 'Thêm chương' nếu chọn Upload
      showTable1: true, // bảng thêm chapter bằng tay
      modalTitle: '',
      modalContent: '',
      addVisible: false, // visible modal Add
      editVisible: false, // visible modal Edit
      chapters: [], // lưu trữ chapter của bảng
      chaptersUpload: [], //chapter Upload files
      count: 0,
      fileName: '',
      keyModal: null,
      selectedRow: dataz,
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
      // {
      //   title: 'Nội dung',
      //   dataIndex: 'content',
      //   key: 'content',
      //   width: '30%',
      // },
      {
        title: 'Lựa chọn',
        // dataIndex: 'operation',
        key: 'operation',
        width: '20%',
        render: (text, record) => {
          return this.state.chapters.length >= 1 ? (
            <div>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => this.handleEdit(record.key)}>
                      <a>Chỉnh sửa</a>
                    </Menu.Item>
                    <Menu.Item onClick={() => this.handleDelete(record.key)}>
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
          ) : null;
        },
      },
    ];
    return columns;
  };
  // Submit form
  handleSubmit = e => {
    e.preventDefault();
    let { chapters, chaptersUpload, fileName } = this.state;

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      //API POST BOOK BY UI
      chapters = chapters.map(chapter => {
        return {
          ...chapter,
          orderNo: chapter.key,
        };
      });

      const categories = fieldsValue['categories'].map(category => {
        return {
          id: category,
        };
      });


      fieldsValue['authors'] = fieldsValue['authors'].map(author => {
        return {
          id: author,
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
          authors: fieldsValue['authors'],
          publicYear: fieldsValue['month_picker'].format('YYYY'),
          pageNumber: fieldsValue['pageNumber'],
          fileName: fileName,
          chapters: chapters.concat(chaptersUpload),
        },
      }).then(res => {
        if (res.status === 200 && res.data.status) {
          window.location.reload();
        } else {
          alert('Upload sách lỗi');
        }
      });

      let path = '/manager-book';
      this.props.history.push(path);
    });
  };

  //Function Modal
  showModal = () => {
    this.setState({
      showTable1: true,
    });
  };
  setAddVisible(addVisible) {
    this.setState({
      addVisible,
      showTable1: true,
    });
  }

  setEditVisible(editVisible) {
    this.setState({ editVisible });
  }
  handleCancel = () => {
    this.setState({ addVisible: false, editVisible: false });
  };
  //Thêm chương bằng UI
  handleCreate = () => {
    const form = this.formRef.props.form;
    const { count, chapters } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      const newData = {
        key: count,
        title: values.modalTitle,
        content: values.modalContent,
      };
      this.setState({
        chapters: [...chapters, newData],
        count: count + 1,
        addVisible: false,
        showTable1: true,
        disableButton: false,
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  //Sửa chương
  handleEdit = key => {
    const chapters = [...this.state.chapters];
    const chapter = chapters.filter(item => item.key === key);
    this.props.form.setFieldsValue({
      modalTitleEdit: chapter[0].title,
      modalContentEdit: chapter[0].content,
    });
    this.setState({ editVisible: true, keyModal: key });
  };
  handleSave = e => {
    e.preventDefault();
    const { keyModal, chapters } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      let values = [
        fieldsValue['modalTitleEdit'],
        fieldsValue['modalContentEdit'],
      ];
      this.setState({
        chapters: chapters.map(item => {
          if (item.key !== keyModal) return item;
          return {
            ...item,
            title: values[0],
            content: values[1],
          };
        }),
        editVisible: false,
      });
    });
  };
  //Xóa chương
  handleDelete = key => {
    const chapters = [...this.state.chapters];
    this.setState({ chapters: chapters.filter(item => item.key !== key) });
  };
  //Xóa chương theo hành động
  handleDeleteAll = () => {
    const selectedRows = this.state.selectedRow;
    const lastIndex = selectedRows.length - 1;
    console.log(selectedRows[lastIndex]);
  };
  //Function click button Upload ,change TableUploadBook ,disable button 'Thêm chương'
  handleClickTable = () => {
    this.setState({
      showTable1: false,
      showTable2: true,
      disaleButtonAdd: true,
    });
  };

  render() {
    const {
      disableButton,
      disaleButtonAdd,
      showTable1,
      chaptersUpload,
      chapters,
    } = this.state;

    //API upload book
    const props = {
      name: 'file',
      multiple: true,
      accept: '.DOCX, .DOC, .TXT',
      disabled: false,
      showUploadList: false,
      withCredentials: true,
      action: 'http://localhost:8080/api/v1/books/upload-book-content',
      onChange: info => {
        const { status } = info.file;
        if (status === 'done') {
          const { response } = info.file;

          if (response.status === 1) {
            this.setState({
              chaptersUpload: response.results.chapters,
              fileName: info.file.name,
              disableButton: false,
            });
            message.success(`File ${info.file.name} upload thành công !`);
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
          dataSource={this.state.chapters.concat(chaptersUpload)}
          columns={this.getColumns()}
          rowSelection={rowSelection}
          rowKey={record => record.title}
        />
      );
    }

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
        <Form onSubmit={this.handleSubmit} chapters={this.state.chapters}>
          <div className="form_add_infobook">
            <FormItem {...formItemLayout} label="Tên sách">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Tên sách không được để trống!',
                  },
                ],
              })(<Input onChange={this.onChangeForm} />)}
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
                <Select mode="tags" placeholder="Tên tác giả">
                  {authorsTag}
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
                <Select mode="multiple" placeholder="Chọn thể loại">
                  <Option key="5bcd851a62b4fb262853d6c2">Chính trị</Option>
                  <Option key="5bcd85ccd91f1a2628f15e29">Pháp luật</Option>
                  <Option key="5bcd860cd91f1a2628f15e2a">
                    Khoa học công nghệ
                  </Option>
                  <Option key="5bcd8639d91f1a2628f15e2b">Kinh tế</Option>
                  <Option key="5b977f97911f176704c41f5a">Văn hóa xã hội</Option>
                  <Option key="5b977f97911f176704c41f5f">
                    khoa học xã hội
                  </Option>
                  <Option key="5b977f97911f176704c41f64">Sách quản trị</Option>
                  <Option key="5bcd864fd91f1a2628f15e2c">Lịch sử</Option>
                  <Option key="5bcd8672d91f1a2628f15e2d">
                    Văn học nghệ thuật
                  </Option>
                  <Option key="5bcd86b4d91f1a2628f15e2e">Giáo trình</Option>
                  <Option key="5bcd86dfd91f1a2628f15e2f">Truyện ngắn</Option>
                  <Option key="5bcd86f5d91f1a2628f15e30">Tiểu thuyết</Option>
                  <Option key="5bcd8711d91f1a2628f15e31">Tâm lý</Option>
                  <Option key="5bcd8722d91f1a2628f15e32">Tôn giáo</Option>
                  <Option key="5bcd873fd91f1a2628f15e33">Sách thiếu nhi</Option>
                </Select>,
              )}
            </FormItem>
          </div>
          <hr />
          <div className="action-add-book">
            <Button
              type="primary"
              className="add_chapter"
              onClick={() => this.setAddVisible(true)}
              disabled={disaleButtonAdd}
            >
              <Icon type="plus-circle" theme="outlined" />
              Thêm chương
            </Button>
            {/* Modal Add book */}
            <ModalAdd
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.addVisible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
            {/* Modal Edit Book */}
            <Modal
              visible={this.state.editVisible}
              chapters={chapters}
              onCancel={this.handleCancel}
              title="Sửa chương"
              okText="Lưu"
              cancelText="Hủy"
              width={900}
              footer={null}
            >
              <Form layout="vertical" onSubmit={this.handleSave}>
                <FormItem label="Tiêu đề">
                  {getFieldDecorator('modalTitleEdit')(<Input />)}
                </FormItem>
                <FormItem label="Nội dung">
                  {getFieldDecorator('modalContentEdit')(
                    <TextArea rows={16} />,
                  )}
                </FormItem>
                <FormItem>
                  <Button onClick={this.handleCancel}>Hủy</Button>
                  &nbsp;
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
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

            <Select
              className="select_action"
              style={{ width: 140 }}
              placeholder="Hành động"
            >
              <Option value="delete" onClick={this.handleDeleteAll}>
                Xóa
              </Option>
            </Select>
            {/* Table */}
            {table}
          </div>
          <Button
            className="addbook"
            type="primary"
            htmlType="submit"
            disabled={disableButton}
          >
            Thêm sách
          </Button>
        </Form>
      </AddbookUIStyle>
    );
  }
}
const App = Form.create()(AddBookUI);

export default App;
