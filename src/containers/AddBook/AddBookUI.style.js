import styled from 'styled-components';

const AddbookUIStyle = styled.div`
  margin-top: 10px;
  font-weight: 700;
  font-family: Arial;
  font-size: 16px;
  .ant-breadcrumb a {
    font-size: 18px;
    color: black;
  }
  h3 {
    margin-top: 10px;
  }
  h4 {
    margin-top: 10px;
  }
  .form_add_infobook {
    border: 1px solid #ddd;
    margin-top: 10px;
    width: 80%;
    height: 500px;
    padding-left: 90px;
    margin-left: 90px;
  }
  .ant-row.ant-form-item {
    float: left;
    width: 50%;
  }
  .ant-form-item-required {
    float: left;
  }
  .add_chapter {
    margin-top: 10px;
    margin-left: 120px;
    height: 40px;
  }
  .upload_chapter {
    margin-left: 540px;
    height: 40px;
    width: 150px;
    background-color: #e37b24;
  }

  hr {
    width: 95%;
    margin-top: 10px;
  }
  .selectact {
    width:150px;
    margin-left: 90px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .selectact dropdown {
    background-color: #40a9ff;
  }
  .ant-table-content {
    margin-left: 90px;
    margin-right: 140px;
  }
  .ant-select-selection.ant-select-selection--single {
    width: 150px;
    height: 40px;
    font-size: 16px;
  }

  .pick_time_puslish {
    width: 322px;
  }
  .number-page {
    width: 322px;
  }
  .ant-pagination.ant-table-pagination {
    margin-right: 200px;
  }
  .addbook {
    margin: 30px;
    width: 150px;
    height: 40px;
    margin-left: 800px;
  }
  .table-addchapter {
    margin-top: 15px;
    border: 1px solid #ddd;
    width: 80%;
    margin-left: 90px;
    padding-left: 20px;
  }
  .table-thead {
    background-color: #cfcdcf;
  }
  td,
  tr {
    height: 50px;
    padding-left: 10px;
  }
  .chapter-table {
    width: 70%;
  }
  .content-table {
    color: #40a9ff;
  }

  .select-content select {
    width: 10px;
  }
`;

export { AddbookUIStyle };
