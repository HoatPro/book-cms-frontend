import React from 'react';
import { Table, Icon, Input } from 'antd';
import { UsersRolesWrapper } from './UsersRoles.style';

const Search = Input.Search;
const data = [
  {
    key: '1',
    email: 'nguyenvana@gmail.com',
    name: 'Van A',
    role: 'Admin',
  },
  {
    key: '2',
    email: 'nguyenvanb@gmail.com',
    name: 'Van ',
    role: 'Editor',
  },
  {
    key: '3',
    email: 'lethic@gmail.com',
    name: 'Le C ',
    role: 'Manager',
  },
  {
    key: '4',
    email: 'tranthanhhoa@gmail.com',
    name: 'Thanh Hoa',
    role: 'Admin',
  },
  {
    key: '5',
    email: 'ngocphong@gmail.com',
    name: 'Ngoc Phong',
    role: 'Legal,Admin',
  },
];
class UsersRoles extends React.Component {
  getColums = () => {
    const columns = [
      {
        title: 'UserID',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
      },
    ];
    return columns;
  };
  handleClick = () => {
    let path = `/user-role/add-user`;
    this.props.history.push(path);
  };
  handleDetail = email => {
    let path = `/user-role/detail-user`;
    this.props.history.push(path);
  };
  render() {
    return (
      <UsersRolesWrapper>
        <h4>USERS AND ROLES </h4>
        <hr />
        <div className="user_wrapper">
          <a onClick={this.handleClick}>
            User(5)&nbsp;
            <Icon type="plus-circle" />
          </a>
          <Search className="search" placeholder="Tìm kiếm..." />
          <div className="table_user">
            <Table
              className="table_user_role"
              columns={this.getColums()}
              dataSource={data}
              bordered
              pagination={false}
              onRow={record => {
                return {
                  onClick: () => {
                    this.handleDetail(record.email);
                  }, // click row
                  onMouseEnter: () => {}, // mouse enter row
                };
              }}
            />
          </div>
        </div>
      </UsersRolesWrapper>
    );
  }
}
export default UsersRoles;
