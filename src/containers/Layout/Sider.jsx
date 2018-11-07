import React from 'react';
import { Menu, Icon } from 'antd';
import { SiderWrapper } from './Layout.style';
import { Link } from 'react-router-dom';
class Siders extends React.Component {
  handleClick = () => {
    window.location.reload();
  };
  render() {
    return (
      <SiderWrapper>
        <Menu>
          <Menu.Item key="1">
            <span>
              <Icon type="home" />
              <span>Tổng quan </span>
            </span>
          </Menu.Item>

          <Menu.Item key="2" onClick={this.handleClick}>
            <Link to="/manager-book">
              <span>
                <Icon type="book" />
                <span>Quản lý sách</span>
              </span>
            </Link>
          </Menu.Item>

          <Menu.Item key="3">
            <span>
              <Icon type="bars" />
              <span>Quản lý thể loại</span>
            </span>
          </Menu.Item>
          <Menu.Item key="4">
            <span>
              <Icon type="appstore" />
              <span>Quản lý tác giả</span>
            </span>
          </Menu.Item>
          <Menu.Item key="5">
            <span>
              <Icon type="bar-chart" />
              <span>Thống kê</span>
            </span>
          </Menu.Item>
          <Menu.Item key="6">
            <span>
              <Icon type="team" />
              <span>Người dùng và quyền</span>
            </span>
          </Menu.Item>
        </Menu>
      </SiderWrapper>
    );
  }
}

export default Siders;
