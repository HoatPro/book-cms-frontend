import React from 'react';
import { AddbookUIStyle } from './AddBookUI.style';
import { Link } from 'react-router-dom';
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
  Modal,
  InputNumber,
  Dropdown,
  Menu,
  Table,
} from 'antd';
// import TableAddChapter from './TableAddChapter';
import TableUploadBook from './TableUploadBook';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const { Column } = Table;

const { MonthPicker } = DatePicker;
// rowSelection chọn phần tử trong bảng
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
};
const data = [
  {
    key: '1',
    chapter: 'No data',
  },
];

// Kiểm tra upload file
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function handleChange(value) {
  console.log(`selected ${value}`);
}
function handleBlur() {
  console.log('blur');
}
function handleFocus() {
  console.log('focus');
}
//Tên tác giả
const children = [];
children.push(
  <Option key="nguyen-nhat-anh">Nguyễn Nhật Ánh</Option>,
  <Option key="nguyen-ngoc-thach">Nguyễn Ngọc Thạch</Option>,
  <Option key="than-dong">Thần Đồng</Option>,
);

class AddBookUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoCompleteResult: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      visible: false,
      children: [],
      disableButton: true, //  disable button 'Thêm sách'
      value: [], // lấy giá trị title chapter
      showTable1: true, // bảng thêm chapter bằng tay
      showTable2: false, // bảng thêm chapter qua file upload
    };
  }
  // Submit form
  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let values = {
        'Tên sách': fieldsValue['name_book'],
        'Thể loại': fieldsValue['kind'],
        'Tác giả': fieldsValue['author'],
        'Nhà xuất bản': fieldsValue['publishing_company'],
        'Năm,tháng xuất bản sách': fieldsValue['month_picker'].format(
          'MM-YYYY',
        ),
        'Người dịch': fieldsValue['editor'],
        'Số trang': fieldsValue['number_page'],
      };
      // console.log(values);
      let path = '/';
      this.props.history.push(path);
      console.log(this.props.history);
    });
  };

  //Function Modal
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
      disableButton: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleEdit = e => {
    console.log(e);
    this.setState({
      visible: true,
    });
  };
  //Get data in Modal
  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log(event.target.value);
  }
  handleDelete = e => {
    this.setState({
      value: null,
    });
  };
  //Function click button Upload ,change TableUploadBook ,disable button 'Thêm chương'
  handleClickTable = () => {
    this.setState({
      showTable1: false,
      showTable2: true,
    });
  };
  // Function change author ,add new author
  handleChangeAuthor = value => {
    console.log(`selected ${value}`);
  };

  render() {
    const { disableButton, showTable1, showTable2 } = this.state;
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
        <Table bordered={true} rowSelection={rowSelection} dataSource={data}>
          <Column
            title="Chương"
            dataIndex="chapter"
            key="chapter"
            render={() => (
              <span>
                <a href="javascript:;">{this.state.value} </a>
              </span>
            )}
          />
          <Column
            title="Lựa chọn"
            dataIndex="choice"
            key="choice"
            render={() => (
              <div>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <a onClick={this.showModal}>Chỉnh sửa</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a onClick={this.handleDelete}>Xóa</a>
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button>
                    <Icon type="down" theme="outlined" />
                    Lựa chọn
                  </Button>
                </Dropdown>
              </div>
            )}
          />
        </Table>
      );
    }
    if (showTable2) {
      table = <TableUploadBook />;
    }

    return (
      <AddbookUIStyle>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Quản lý sách</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/addbookui">Thêm sách bằng giao diện</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit}>
          <div className="form_add_infobook">
            <FormItem {...formItemLayout} label="Tên sách">
              {getFieldDecorator('name_book', {
                rules: [
                  {
                    required: true,
                    message: 'Điền tên sách!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Nhà xuất bản">
              {getFieldDecorator('publishing_company', {
                rules: [
                  {
                    required: true,
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
                    required: true,
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
              {getFieldDecorator('editor', {
                rules: [
                  {
                    required: true,
                    message: 'Điền tên người dịch !',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Tác giả">
              {getFieldDecorator('author', {
                rules: [
                  {
                    required: true,
                    message: 'Điền tên tác giả của sách!',
                  },
                ],
              })(
                <Select
                  mode="tags"
                  placeholder="Tên tác giả"
                  style={{ width: '100%' }}
                >
                  {children}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Số trang">
              {getFieldDecorator('number_page', {
                rules: [
                  {
                    required: true,
                    message: 'Số trang sách hiện tại !',
                  },
                ],
              })(<InputNumber name="number_page" className="number-page" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Thể loại">
              {getFieldDecorator('kind', {
                rules: [
                  {
                    required: true,
                    message: 'Điền thể loại sách !',
                  },
                ],
              })(
                <Select mode="multiple" placeholder="Chọn thể loại">
                  <Option value="chinhtri">Chính trị </Option>
                  <Option value="phapluat">Pháp luật </Option>
                  <Option value="khcn">Khoa học công nghệ </Option>
                  <Option value="kinhte">Kinh tế</Option>
                  <Option value="vhxh"> Văn hóa xã hội</Option>
                  <Option value="lichsu"> Lịch sử</Option>
                  <Option value="vhnt"> Văn học nghệ thuật</Option>
                  <Option value="gt"> Giáo trình</Option>
                  <Option value="truyenngan"> Truyện ngắn</Option>
                  <Option value="tieuthuyet"> Tiểu thuyết</Option>
                  <Option value="tamly"> Tâm lý</Option>
                  <Option value="tongiao"> Tôn giáo</Option>
                  <Option value="stn"> Sách thiếu nhi</Option>
                </Select>,
              )}
            </FormItem>
          </div>
          <hr />
          <div className="action-add-book">
            <Button
              type="primary"
              className="add_chapter"
              onClick={this.showModal}
            >
              <Icon type="plus-circle" theme="outlined" />
              Thêm chương
            </Button>
            {/* Modal Add book */}
            <Modal
              width={900}
              className="modal"
              title="Thêm chương"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="Thêm"
              cancelText="Hủy"
            >
              <Form layout="vertical">
                <FormItem label="Tiêu đề">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: 'Tên tiêu đề không được để trống',
                      },
                    ],
                  })(
                    <Input
                      placeholder="Tên tiêu đề"
                      onBlur={this.handleChange.bind(this)}
                    />,
                  )}
                </FormItem>
                <FormItem label="Nội dung">
                  {getFieldDecorator('content')(<TextArea rows={16} />)}
                </FormItem>
              </Form>
            </Modal>
            <Upload {...props} showUploadList={false}>
              <Button
                className="upload_chapter"
                onClick={this.handleClickTable}
              >
                <Icon type="upload" /> Tải lên
              </Button>
            </Upload>
            <hr />
            <div className="selectact">
              <Select
                showSearch
                placeholder="Hành động"
                style={{ width: 100 }}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <Option value="edit" onClick={this.showModal}>
                  Chỉnh sửa
                </Option>
                <Option value="delete">Xóa</Option>
                <Option value="analyze">Tách lại </Option>
              </Select>
            </div>

            {/* Table input */}
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
