import React from 'react';
import { Table, Menu, Button, Input, Dropdown, Icon } from 'antd';
import { ManagerCategoryWrapper } from './ManagerCategory.style';
import ModalEditCategory from './ModalEditCategory';
import ModalAddCategory from './ModalAddCategory';
const Search = Input.Search;

const data = [
  {
    key: '1',
    index: '1',
    name: 'Tiểu thuyết',
    createdBy: 'vodanh1204@gmail.com',
    createdAt: '',
  },
  {
    key: '2',
    index: '2',
    name: 'Truyện ngắn',
    createdBy: 'vodanh1204@gmail.com',
    createdAt: '',
  },
];
class ManagerCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visibleEdit: false, visibleAdd: false };
  }
  showModalEdit = () => {
    this.setState({ visibleEdit: true });
  };
  showModalAdd = () => {
    this.setState({ visibleAdd: true });
  };
  closeModal = visible => {
    console.log(visible);
    this.setState({ visibleEdit: visible, visibleAdd: visible });
  };
  getColums = () => {
    const columns = [
      {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'Tên thể loại',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Người tạo',
        dataIndex: 'createdBy',
        key: 'createdBy',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: 'Lựa chọn',
        dataIndex: 'choice',
        key: 'choice',
        render: () => {
          const menu = (
            <Menu>
              <Menu.Item style={{ width: 80 }}>Xóa</Menu.Item>
            </Menu>
          );

          return (
            <Dropdown.Button
              overlay={menu}
              trigger={['click']}
              placement="bottomCenter"
            >
              <p onClick={this.showModalEdit}>Chỉnh sửa</p>
            </Dropdown.Button>
          );
        },
      },
    ];
    return columns;
  };
  render() {
    return (
      <ManagerCategoryWrapper>
        <h3>Quản lý thể loại</h3>
        <hr />
        <div className="home-content">
          <div className="action">
            <Button type="primary" onClick={this.showModalAdd}>
              <Icon type="plus" />
              Thêm
            </Button>
            <Search className="search" placeholder="Tìm kiếm thể loại..." />
          </div>
          <div className="table-author">
            <Table
              className="table-detail"
              columns={this.getColums()}
              dataSource={data}
              bordered
            />
          </div>
          <div className="modal-add">
            <ModalAddCategory
              visible={this.state.visibleAdd}
              closeModal={this.closeModal}
            />
          </div>
          <div className="modal-edit">
            <ModalEditCategory
              visible={this.state.visibleEdit}
              closeModal={this.closeModal}
            />
          </div>
        </div>
      </ManagerCategoryWrapper>
    );
  }
}
export default ManagerCategory;
