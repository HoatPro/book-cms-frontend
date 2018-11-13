import React from 'react';
import { UsersRolesWrapper } from './UsersRoles.style';
import { Button, Checkbox, Row, Col, Tooltip, Icon, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
class DetailUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserInfo: true,
      colorInfo: '#5ECCFF',
      colorRole: '#000',
    };
  }
  handleRole = () => {
    this.setState({
      showUserInfo: false,
      colorInfo: '#000',
      colorRole: '#5ECCFF',
    });
  };

  handleUserInfo = () => {
    this.setState({
      showUserInfo: true,
      colorInfo: '#5ECCFF',
      colorRole: '#000',
    });
  };
  onChange = checkedValues => {
    console.log('checked = ', checkedValues);
  };
  render() {
    let take = [];
    if (this.state.showUserInfo === true) {
      take = (
        <div className="info_user">
          <p>User Infomation</p>
          <hr />
          <div className="detail_user">
            <div>
              <h5>Name</h5>
              <h6>Thanh Hoa</h6>
            </div>
            <div>
              <h5>Email</h5>
              <h6>tranthanhhoa@clound.com</h6>
            </div>
          </div>
          <hr />
          <div className="delete_user">
            <Button type="danger">Delete User</Button>
          </div>
        </div>
      );
    } else {
      take = (
        <div className="role_user">
          <p>
            Role&nbsp;
            <Tooltip title="Phân quyền user trong hệ thống">
              <Icon type="question-circle-o" />
            </Tooltip>
          </p>
          <hr />
          <div className="role_detail_user">
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
              <Row>
                <Col span={4}>
                  <Checkbox value="legal">Legal</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="admin">Admin</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="manager">Manager</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="editor">Editor</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            <h5>Features</h5>
            <hr />
            <ul>
              <li>Quản lý Users và Roles</li>
              <li>Xem thống kê sách</li>
              <li>Quản lý tất cả các sách</li>
              <li>Quản lý tất cả tác giả</li>
              <li>Quản lý tất cả thể loại</li>
              <li>Chuẩn hóa sách</li>
              <li>Tổng hợp sách</li>
            </ul>
            <hr />
          </div>
        </div>
      );
    }

    return (
      <UsersRolesWrapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/user-role">Uses and Roles</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/user-role/detail-user">Chi tiết thông tin User</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <hr />
        <div className="info_user">
          <h5>Thanh Hoa</h5>
          <h6>tranthanhhoa@clound.com</h6>
        </div>
        {/* phan chia components */}
        <div className="tag">
          <p
            onClick={this.handleUserInfo}
            className="tag_info_user"
            style={{ color: `${this.state.colorInfo}` }}
          >
            User Detail
          </p>
          <p
            onClick={this.handleRole}
            className="tag_role_user"
            style={{ color: `${this.state.colorRole}` }}
          >
            Role
          </p>
        </div>
        <hr />
        {take}
      </UsersRolesWrapper>
    );
  }
}

export default DetailUser;
