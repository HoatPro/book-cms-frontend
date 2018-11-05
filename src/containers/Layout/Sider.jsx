import React from 'react';
import { Menu, Icon } from 'antd';
import { SiderWrapper } from './Layout.style';

class Siders extends React.Component {
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

          <Menu.Item key="2">
            <span>
              <Icon type="book" />
              <span>Quản lý sách</span>
            </span>
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
