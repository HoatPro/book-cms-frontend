import styled from 'styled-components';

const HomeWrapper = styled.div`
  margin-top: 10px;

  font-size: 2rem;
  font-weight: 700;

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
  ul {
    list-style-type: none;
    padding-left: 0px;
  }
  li {
    float: left;
  }
`;

export   { HomeWrapper };
