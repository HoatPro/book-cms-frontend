import React from 'react';
import { Form, Icon, Input, Button, Breadcrumb, message } from 'antd';
import { UsersRolesWrapper } from './UsersRoles.style';
import { Link } from 'react-router-dom';
import axios from 'axios';
const FormItem = Form.Item;
class AddUser extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      axios({
        method: 'POST',
        url: `http://localhost:8080/api/v1/users`,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        data: {
          email: values.email,
          ownerBy: 'danhhuan93@gmail.com',
          name: values.firstName + values.userName,
        },
      }).then(res => {
        console.log(res);
        if (res.status) {
          message.success('Thêm user thành  công!');
          let path = `/user-role`;
          this.props.history.push(path);
        }
      });
    });
  };
  handleCancel = () => {
    let path = `/user-role`;
    this.props.history.push(path);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <UsersRolesWrapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/user-role">Uses and Roles</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/user-role/add-user">Thêm User</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <hr />
        <h6>Thêm thông tin User</h6>
        <hr />
        <div className="form_user_infomation">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem label="First Name:">
              {getFieldDecorator('firstName')(
                <Input placeholder="First Name" />,
              )}
            </FormItem>
            <FormItem label="Last Name:">
              {getFieldDecorator('userName')(<Input placeholder="Last Name" />)}
            </FormItem>
            <FormItem label="Email (This will be the user 's UserID)">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'Tên email không hợp lệ !!',
                  },
                  {
                    required: true,
                    message: 'Email không được để trống',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                />,
              )}
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="form-button"
                style={{ marginRight: '7px' }}
              >
                Thêm
              </Button>
              &nbsp;
              <Button type="danger" onClick={this.handleCancel}>
                Hủy
              </Button>
            </FormItem>
          </Form>
        </div>
      </UsersRolesWrapper>
    );
  }
}
const UserAndRole = Form.create()(AddUser);
export default UserAndRole;
