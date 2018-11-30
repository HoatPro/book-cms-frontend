import React from 'react';
import { HeaderWrapper } from './Layout.style';
import { Dropdown, Icon, Avatar, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { Login } from '.././Login/Login';

const email = 'vodanh1204@gmail.com';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: 'Ha' };
  }
  componentWillReceiveProps(nextProprs) {
    console.log(nextProprs);
  }
  hanleClick = () => {
    console.log(this.props.params);
    console.log('a');
  };
  getEmail = values => {
    console.log(values);
  };
  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="email" onClick={this.hanleClick}>
          {email}
        </Menu.Item>
        <Menu.Item key="logout">
          <Link to="/">Đăng xuất</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <HeaderWrapper>
        <div className="header-wrapper">
          <h3>Hệ thống quản lý sách </h3>
          <div className="info-wrapper">
            <Dropdown overlay={menu}>
              <div className="avatar-header">
                <Avatar
                  style={{
                    backgroundColor: '#00a2ae',
                    verticalAlign: 'middle',
                  }}
                  size="default"
                >
                  {this.state.user}
                  <Icon type="down" />
                </Avatar>
              </div>
            </Dropdown>
          </div>
        </div>
      </HeaderWrapper>
    );
  }
}
export default Header;
