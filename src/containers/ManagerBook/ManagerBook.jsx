import React from 'react';
import { Icon, Input, Button, Table, Select, Dropdown, Menu } from 'antd';
import { ManagerBookWrapper } from './ManagerBook.style';
import { Link } from 'react-router-dom';
import reqwest from 'reqwest';
const Search = Input.Search;
const Option = Select.Option;
// const fields = 'title,createdBy,publicYear,categories,authors';
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, selectedRows[0]);
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
class ManagerBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false,
    };
  }

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
      url: `http://localhost:8080/api/v1/books?fields=title,createdBy,publicYear,categories,authors,status,slug,translator,pageNumber,fileName`,
      method: 'GET',
      withCredentials: true,
      data: {
        results: 5,
        ...params,
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 20;
      this.setState({
        loading: false,
        data: data.results.items,
        pagination,
      });
      // console.log(data.results.items);
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
  // handleClick = () => {
  //   const { data } = this.state;
  //   console.log(data);
  //   let path = `/edit/${data.results.id}`;
  //   this.props.history.push(path);
  //   console.log(this.props.history);
  // };

  render() {
    const { data } = this.state;
    const columns = [
      { title: 'Tên sách', dataIndex: 'title', key: 'title', sorter: true },
      {
        title: 'Tác giả',
        dataIndex: 'authors',
        key: 'authors',
        sorter: true,
        render: record => {
          return record.map(author => author.name).join(', ');
        },
      },
      {
        title: 'Thể loại',
        dataIndex: 'categories',
        key: 'categories',
        sorter: true,
        render: record => {
          return record.map(categories => categories.name).join(', ');
        },
      },
      {
        title: 'Năm xuất bản',
        dataIndex: 'publicYear',
        key: 'publicYear',
        width: '12%',
        sorter: true,
      },
      { title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy' },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        render: status => {
          return status.name;
        },
      },
      {
        title: 'Hành động',
        key: 'action',

        render: record => (
          <div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <a>Tổng hợp</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a>Chuẩn hóa</a>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button
                onClick={() => {
                  this.props.history.push(`/edit/${record.slug}`);
                }}
              >
                <Icon type="down" theme="outlined" />
                Chi tiết
              </Button>
            </Dropdown>
          </div>
        ),
      },
    ];
    return (
      <ManagerBookWrapper>
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
                style={{ width: 180 }}
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
      </ManagerBookWrapper>
    );
  }
}

export default ManagerBook;
