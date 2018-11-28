import React from 'react';
import { Table, Icon, Input } from 'antd';
import { UsersRolesWrapper } from './UsersRoles.style';
import axios from 'axios';
import reqwest from 'reqwest';
const Search = Input.Search;
class UsersRoles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: null,
    };
  }
  //thay đổi trang
  handleTableChange = (pagination, filters) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.callApi({
      results: pagination.pageSize,
      page: pagination.current - 1,
      // keyword: this.state.keyword,
      ...filters,
    });
  };
  async componentDidMount() {
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/users?size=10`,
      withCredentials: true,
    }).then(res => {
      const pagination = { ...this.state.pagination };
      pagination.total = 10 * res.data.results.totalPages;
      const dataUser = res.data.results.items;
      const count = dataUser.length;
      this.setState({ data: dataUser, pagination, count: count });
    });
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/users?size=1`,
      withCredentials: true,
    }).then(res => {
      const count = res.data.results.totalPages;
      this.setState({ count: count });
    });
  }
  callApi = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: `http://localhost:8080/api/v1/users?size=10`,
      method: 'GET',
      withCredentials: true,
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      const {
        results: { totalPages, items },
      } = data;
      pagination.total = 10 * totalPages;
      const dataUser = items;
      this.setState({
        loading: false,
        data: dataUser,
        pagination,
      });
    });
  };
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
    const { count } = this.state;
    return (
      <UsersRolesWrapper>
        <h4>USERS AND ROLES </h4>
        <hr />
        <div className="user_wrapper">
          <p onClick={this.handleClick}>
            User({count})&nbsp;
            <Icon type="plus-circle" />
          </p>
          <Search className="search" placeholder="Tìm kiếm..." />
          <div className="table_user">
            <Table
              className="table_user_role"
              columns={this.getColums()}
              dataSource={this.state.data}
              bordered
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              rowKey={record => record.email}
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
