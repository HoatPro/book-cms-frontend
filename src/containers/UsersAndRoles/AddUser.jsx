import React from 'react';
import { Form, Icon, Input, Button, Breadcrumb } from 'antd';
import { UsersRolesWrapper } from './UsersRoles.style';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
class AddUser extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
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
                <Input placeholder="FirstName" />,
              )}
            </FormItem>
            <FormItem label="Last Name:">
              {getFieldDecorator('userName')(<Input placeholder="LastName" />)}
            </FormItem>
            <FormItem label="Email (This will be the user 's UserID)">
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Email không được để trống' },
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
              <Button type="primary" htmlType="submit" className="form-button">
                Lưu
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
