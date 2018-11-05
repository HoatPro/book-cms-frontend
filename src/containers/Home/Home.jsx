import React from 'react';
import { Icon, Input, Button, Table, Select } from 'antd';
import { HomeWrapper } from './Home.style';
import { Link } from 'react-router-dom';
import axios from 'axios';
import reqwest from 'reqwest';
const Search = Input.Search;
const Option = Select.Option;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, selectedRows);
  },
};

function handleChange(value) {
  console.log(`selected ${value}`);
}
function handleBlur() {
  console.log('blur');
}
function handleFocus() {
  console.log('focus');
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false,
    };
  }
  // async componentDidMount() {
  //   axios({
  //     method: 'GET',
  //     url: 'http://localhost:3000/books',
  //     data: null,
  //   })
  //     .then(res => {
  //       this.setState({
  //         books: res.data,
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/books',
      method: 'GET',
      data: {
        results: 3,
        ...params,
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 10;
      this.setState({ loading: false, data: data.results, pagination });
    });
  };

  componentDidMount() {
    this.fetch();
  }

  handleChange = (pagination, sorter) => {
    console.log('Various parameters', pagination, sorter);
    this.setState({
      sortedInfo: sorter,
    });
  };

  clearAll = () => {
    this.setState({
      sortedInfo: null,
    });
  };
  handleClick = () => {
    let path = 'edit';
    this.props.history.push(path);
  };
  // handleSubmit = values => {
  //   console.log(values);
  // };

  render() {
    const columns = [
      { title: 'Tên sách', dataIndex: 'title', key: 'title', sorter: true },
      {
        title: 'Tác giả',
        dataIndex: 'authors',
        key: 'authors',
        sorter: true,
        render: authors => (
          <ul>
            {authors.map(author => {
              return <li key={author.id}>{author.name},</li>;
            })}
          </ul>
        ),
      },
      {
        title: 'Thể loại',
        dataIndex: 'categories',
        key: 'categories',
        sorter: true,
        render: categories => (
          <ul>
            {categories.map(categorie => {
              return <li key={categorie.id}>{categorie.name},</li>;
            })}
          </ul>
        ),
      },
      {
        title: 'Năm xuất bản',
        dataIndex: 'publishYear',
        key: 'publishYear',
        width: '12%',
        sorter: true,
      },
      { title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy' },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status', sorter: true },
      {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        render: () => (
          <div>
            <Select
              placeholder="Lựa chọn"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="edit">Chỉnh sửa</Option>
              <Option value="synthesis">Tổng hợp </Option>
              <Option value="normalization">Chuẩn hóa</Option>
              <Option value="detail" onClick={this.handleClick}>
                Chi tiết
              </Option>
              <Option value="delete">Xóa</Option>
            </Select>
          </div>
        ),
      },
    ];
    return (
      <HomeWrapper>
        <h3>Quản lý sách</h3>
        <hr />
        <div className="home_content">
          <Search
            placeholder="Tìm kiếm tên sách,tác giả ,thể loại..."
            onSearch={value => console.log(value)}
          />
          <Button className="add_book" type="primary">
            <Link to="/addbook">
              <Icon type="plus-circle" theme="outlined" />
              Thêm sách
            </Link>
          </Button>
          <hr />
          <div>
            <div className="table-operations">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Lựa chọn hành động"
                optionFilterProp="children"
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="normalization">Chuẩn hóa</Option>
                <Option value="synthesis">Tổng hợp</Option>
                <Option value="detail">Tủy chỉnh</Option>
              </Select>
            </div>
            <Table
              bordered={true}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              rowKey={record => record.id}
              // onRow={record => ({
              //   onDoubleClick: () => {
              //     this.handleClick();
              //   },
              // })}
            />
          </div>
        </div>
      </HomeWrapper>
    );
  }
}

export default Home;
