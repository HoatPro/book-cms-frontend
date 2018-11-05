import React from 'react';
import { Button, Icon, Dropdown, Menu, Table } from 'antd';

const { Column } = Table;

// rowSelection chọn phần tử trong bảng
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
};

class TableAddChapter extends React.Component {
  render() {
    return (
      <Table bordered={true} rowSelection={rowSelection}>
        <Column title="Chương" dataIndex="chapter" key="chapter" />
        <Column
          title="Lựa chọn"
          dataIndex="choice"
          key="choice"
          render={() => (
            <div>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <a onClick={this.showModal}>Chỉnh sửa</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a onClick={this.handleDelete}>Xóa</a>
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomLeft"
              >
                <Button>
                  <Icon type="down" theme="outlined" />
                  Lựa chọn
                </Button>
              </Dropdown>
            </div>
          )}
        />
      </Table>
    );
  }
}

export default TableAddChapter;
