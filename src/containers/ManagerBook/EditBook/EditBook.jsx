import React from 'react';
import { EditBookWapper } from './EditBook.style';
import { Link } from 'react-router-dom';
import TableBook from './TableBook';
import TableSynthesis from './TableSynthesis';
import axios from 'axios';
import { Breadcrumb, Form, Input, Select, Button, Modal, message } from 'antd';
import { visible } from 'ansi-colors';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
function handleChange(value) {
  console.log(`selected ${value}`);
}
class EditBook extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    chapters: [],
    objChapters: {},
    dataCategory: [],
    dataAuthor: [],
  };

  async componentWillMount() {
    const slug = this.props.match.params.slug;
    const bookId = slug.substring(slug.length - 24);
    //get Data category
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/categories?fileds=name `,
      withCredentials: true,
    }).then(res => {
      const dataCategory = res.data.results.items;
      this.setState({
        dataCategory: dataCategory,
      });
    });
    //get Data Author
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/authors?fileds=name `,
      withCredentials: true,
    }).then(res => {
      const dataAuthor = res.data.results.items;
      this.setState({ dataAuthor: dataAuthor });
    });
    // get Data form
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/books/${bookId}`,
      withCredentials: true,
    }).then(res => {
      const infoBook = res.data.results;
      this.props.form.setFieldsValue({
        title: infoBook.title,
        publishingCompany: infoBook.publishingCompany,
        categories: infoBook.categories.map(category => category.id),
        publicYear: infoBook.publicYear,
        authors: infoBook.authors.map(author => author.id),
        pageNumber: infoBook.pageNumber,
        translator: infoBook.translator,
        // fileName: infoBook.fileName,
        status: infoBook.status.name,
      });
    });

    //get data chapter
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters`,
      withCredentials: true,
    }).then(response => {
      if (response.status) {
        const chapters = response.data.results;
        this.setState({ chapters: chapters }, function() {
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

  async updateApi(bookId, fieldsValue) {
    fieldsValue['authors'] = fieldsValue['authors'].map(author => {
      return {
        id: author,
      };
    });
    fieldsValue['categories'] = fieldsValue['categories'].map(category => {
      return {
        id: category,
      };
    });
    const options = {
      method: 'PUT',
      url: `http://localhost:8080/api/v1/books/${bookId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {
        title: fieldsValue['title'],
        publishingCompany: fieldsValue['publishingCompany'],
        publicYear: fieldsValue['publicYear'],
        pageNumber: fieldsValue['pageNumber'],
        translator: fieldsValue['translator'],
        authors: fieldsValue['authors'],
        categories: fieldsValue['categories'],
      },
    };
    const {
      status,
      data: { data },
    } = await axios(options);

    if (status) {
      message.success('Chỉnh sửa và lưu thành công !');
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const slug = this.props.match.params.slug;
    const bookId = slug.substring(slug.length - 24);
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      this.updateApi(bookId, fieldsValue);
    });
  };

  // Chuẩn hóa
  info = () => {
    const slug = this.props.match.params.slug;
    const bookId = slug.substring(slug.length - 24);
    confirm({
      title: 'Bạn có muốn chuẩn hóa hay không?',
      content: (
        <div>
          <a>Thao tác này không thể hoàn tác</a>
        </div>
      ),
      onOk() {
        axios({
          method: 'GET',
          url: `http://localhost:8080/api/v1/books/${bookId}/normalization`,
          withCredentials: true,
        }).then(response => {
          if (response.status === 200 && response.data.status === 1) {
            message.info('Chuẩn hóa sách thành công đưa vào hàng đợi...');
            window.location.reload();
          }
        });
      },
      onCancel() {
        console.log('Hủy');
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const slug = this.props.match.params.slug;
    const bookId = slug.substring(slug.length - 24);

    // const { data } = this.state;
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

    const { dataCategory } = this.state;
    const selectCategory = [];
    dataCategory.map(data => {
      selectCategory.push(<Option key={data.id}>{data.name}</Option>);
    });

    const { dataAuthor } = this.state;
    const selectAuthor = [];
    dataAuthor.map(data => {
      selectAuthor.push(<Option key={data.id}>{data.name}</Option>);
    });

    return (
      <EditBookWapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/manager-book">Quản lý sách</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Xem chi tiết sách</Breadcrumb.Item>
        </Breadcrumb>

        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Tên sách">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Tên sách không được để trống !',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Nhà xuất bản">
            {getFieldDecorator('publishingCompany', {
              rules: [
                {
                  required: false,
                  message: 'Tên nhà xuất bản sách :',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Năm xuất bản">
            {getFieldDecorator('publicYear', {
              rules: [
                {
                  required: false,
                  message: 'Năm xuất bản sách',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Tổng số trang">
            {getFieldDecorator('pageNumber', {
              rules: [
                {
                  required: false,
                  message: 'Tổng số trang của sách hiện tại',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Người dịch">
            {getFieldDecorator('translator', {
              rules: [
                {
                  required: false,
                  message: 'Tên người dịch',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Tên file upload">
            {getFieldDecorator('fileName', {
              rules: [
                {
                  required: false,
                  message: 'Tên file đã upload lên',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Trạng thái ">
            {getFieldDecorator('status', {
              rules: [
                {
                  required: false,
                  message: 'Trạng thái của sách',
                },
              ],
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Tác giả">
            {getFieldDecorator('authors', {
              rules: [
                {
                  required: false,
                  message: 'Tên tác giả của sách :',
                },
              ],
            })(
              <Select mode="multiple" placeholder="Chọn tác giả">
                {selectAuthor}
              </Select>,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Thể loại">
            {getFieldDecorator('categories', {
              rules: [
                {
                  required: false,
                  message: 'Thể loại sách :',
                },
              ],
            })(
              <Select mode="multiple" placeholder="Chọn thể loại">
                {selectCategory}
              </Select>,
            )}
          </FormItem>

          {/*
          <FormItem {...formItemLayout} label="ISBN">
            {getFieldDecorator('isbn', {
              rules: [
                {
                  type: 'number',
                  required: true,
                  message: 'Mã ISBN của sách',
                },
              ],
            })(<Input />)}
          </FormItem>

         */}

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
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          <Option value="manh-dung">Mạnh Dũng(Nam HN)</Option>
          <Option value="mai-phuong">Mai Phương(Nữ HN)</Option>
          <Option value="nhat-nam">Nhất Nam(Nam Sài Gòn) </Option>
          <Option value="thuy-linh">Thùy Linh(Nữ HN)</Option>
        </Select>
        <hr />

        <TableBook bookId={bookId} />

        <hr />
        <div className="allbook">
          <div className="manager_synthesis">
            <div className="manager_synthesis_left">
              <h3>Quản lý tổng hợp chương</h3>
              <p>Dùng để quản lý tổng hợp chương</p>
            </div>
            <div className="manager_synthesis_right">
              <h4>Quản lý tổng hợp</h4>

              <TableSynthesis />
            </div>
          </div>
          <div className="manager_normalization">
            <div className="manager_normalization_left">
              <h3>Chuẩn hóa </h3>
              <p>Chuẩn hóa tự động chạy</p>
              <p>Vui lòng chờ 5-10 phút</p>
            </div>
            <div className="manager_normalization_right">
              <h4>Nhấn vào đây để chuẩn hóa</h4>
              <Button type="default" onClick={this.info}>
                Chuẩn hóa
              </Button>
            </div>
          </div>
        </div>
        <hr />
        <div className="delete">
          <h4>Nhấn vào đây để xóa</h4>
          <Button type="danger">Delete</Button>
        </div>
      </EditBookWapper>
    );
  }
}

const App = Form.create()(EditBook);

export default App;
