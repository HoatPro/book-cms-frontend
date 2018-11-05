import React from 'react';
import { EditBookWapper } from './EditBook.style';
import { Link } from 'react-router-dom';
import TableBook from './TableBook';
import Normalization from './Normalization';

import {
  Breadcrumb,
  Form,
  Input,
  Select,
  Button,
  Modal,
  InputNumber,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}

function handleBlur() {
  console.log('blur');
}

function handleFocus() {
  console.log('focus');
}

class EditBook extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    visible: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <EditBookWapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Quản lý sách</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/addbookui">Xem chi tiết sách</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Tên sách">
            {getFieldDecorator('text', {
              rules: [
                {
                  type: 'text',
                  message: 'The input is not empty',
                },
                {
                  required: true,
                  message: 'Please input name book',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Nhà xuất bản">
            {getFieldDecorator('publishingCompany', {
              rules: [
                {
                  type: 'text',
                  message: '',
                },
                {
                  required: true,
                  message: 'Tên nhà xuất bản sách',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Thể loại">
            {getFieldDecorator('kind', {
              rules: [
                {
                  type: 'text',
                  message: '',
                },
                {
                  required: true,
                  message: "Please input kind's book",
                },
              ],
            })(
              <Select mode="multiple" placeholder="Chọn thể loại">
                <Option value="ct-pl">Chính trị – pháp luật</Option>
                <Option value="khcn-kt">Khoa học công nghệ – Kinh tế</Option>
                <Option value="vhxh-ls"> Văn hóa xã hội – Lịch sử</Option>
                <Option value="vhnt"> Văn học nghệ thuật</Option>
                <Option value="gt"> Giáo trình</Option>
                <Option value="tr-tt"> Truyện, tiểu thuyết</Option>
                <Option value="tamly"> Tâm lý, tâm linh, tôn giáo</Option>
                <Option value="stn"> Sách thiếu nhi</Option>
              </Select>,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Năm xuất bản">
            {getFieldDecorator('yearPuslish', {
              rules: [
                {
                  required: true,
                  message: 'Năm xuất bản sách',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Tác giả">
            {getFieldDecorator('author', {
              rules: [
                {
                  type: 'text',
                  message: '',
                },
                {
                  required: true,
                  message: 'Tên tác giả của sách',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Người dịch">
            {getFieldDecorator('text', {
              rules: [
                {
                  type: 'text',
                  message: '',
                },
                {
                  required: true,
                  message: 'Tên người dịch',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="ISBN">
            {getFieldDecorator('isbn', {
              rules: [
                {
                  type: 'number',
                  message: '',
                },
                {
                  required: true,
                  message: 'Mã ISBN của sách',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Số chương">
            {getFieldDecorator('numberchapter', {
              rules: [
                {
                  type: 'number',
                  message: '',
                },
                {
                  required: true,
                  message: 'Số chương của sách hiện tại',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Tên file upload">
            {getFieldDecorator('fileupload', {
              rules: [
                {
                  type: 'text',
                  message: '',
                },
                {
                  required: true,
                  message: 'Tên file đã upload lên',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Tổng số trang">
            {getFieldDecorator('numberpage', {
              rules: [
                {
                  type: 'number',
                  message: '',
                },
                {
                  required: true,
                  message: 'Tổng số trang của sách hiện tại',
                },
              ],
            })(<Input />)}
          </FormItem>
          <Button type="primary" htmlType="submit" className="btn-submit">
            Lưu
          </Button>
        </Form>
        <hr />
        <audio controls preload="none" className="audio">
          <source src="media/vincent.mp3" type="audio./mpeg" />
        </audio>
        <Select
          className="selectaudio"
          showSearch
          style={{ width: 200 }}
          placeholder="Chọn giọng "
          optionFilterProp="children"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          <Option value="manhdung">Mạnh Dũng(Nam HN)</Option>
          <Option value="maiphuong">Mai Phương(Nữ HN)</Option>
          <Option value="nhatnam">Nhất Nam(Nam Sài Gòn) </Option>
          <Option value="thuylinh">Thùy Linh(Nữ HN)</Option>
        </Select>
        <hr />
        <Select
          className="selectact"
          showSearch
          style={{ width: 200 }}
          placeholder="Hành động"
          optionFilterProp="children"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          <Option value="synthesis">Tổng hợp</Option>
          <Option value="normalization">Chuẩn hóa</Option>
          <Option value="delete">Xóa </Option>
        </Select>
        <TableBook />
        <hr />
        <div className="allbook">
          <div className="manager_synthesis">
            <div className="manager_synthesis_left">
              <h3>Quản lý tổng hợp chương</h3>
              <p>Dùng để quản lý tổng hợp chương</p>
            </div>
            <div className="manager_synthesis_right">
              <h4>Quản lý tổng hợp</h4>
              <Button type="primary">Tổng hợp</Button>
            </div>
          </div>
          <div className="manager_normalization">
            <div className="manager_normalization_left">
              <h3>Chuẩn hóa </h3>
              <p>Chuẩn hóa bằng tay dùng để...</p>
            </div>
            <div className="manager_normalization_right">
              <h4>Nhấn vào đây để chuẩn hóa</h4>
              <Button type="default" onClick={this.showModal}>
                Chuẩn hóa
              </Button>
              <div>
                <Modal
                  title="Chuẩn hóa nội dung"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  okText="Ghi nhận thay đổi"
                  cancelText="Hủy"
                  width={900}
                >
                  <Normalization />
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="delete">
          <h4>Nhấn vào đây để xóa</h4>
          <Button type="danger">Delete</Button>
        </div>
        <hr />
      </EditBookWapper>
    );
  }
}

const App = Form.create()(EditBook);

export default App;
