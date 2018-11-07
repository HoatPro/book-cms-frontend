import styled from 'styled-components';

const ManagerBookWrapper = styled.div`
  margin-top: 10px;
  font-size: 2rem;
 .table-operations {
    margin-bottom: 16px;
  }
  .table-operations > button {
    margin-right: 8px;
  }
  .table-operations > select {
    color: red;
  }
  .ant-btn.add_book {
    float: right;
    margin-right: 100px;
    margin-top: 15px;
    padding-left: 10px;
  }
  .ant-input-search.ant-input-affix-wrapper {
    width: 500px;
  }
  .ant-pagination.ant-table-pagination {
    margin-right: 20px;
  }

`;

export   { ManagerBookWrapper };
