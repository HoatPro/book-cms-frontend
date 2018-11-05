import React from 'react';
import { Table } from 'antd';

const { Column } = Table;

class TableAddChapter extends React.Component {
  render() {
    return (
      <Table bordered={true}>
        <Column title="CHƯƠNG" dataIndex="chapter" key="chapter" width="20%" />
        <Column
          title="NỘI DUNG SÁCH"
          dataIndex="content"
          key="content"
          width="80%"
        />
      </Table>
    );
  }
}

export default TableAddChapter;
