import styled from 'styled-components';

const EditBookWapper = styled.div`
  margin-top: 10px;
  font-weight: 700;
  font-family: Arial;
  .ant-breadcrumb a {
    font-size: 18px;
    color: black;
  }

  h3 {
    margin-top: 30px;
  }

  h4 {
    margin-top: 30px;
  }
  .ant-form.ant-form-horizontal {
    border: 1px solid #ddd;
    margin-top: 30px;
    width: 90%;
    height: 580px;
    padding-left: 100px;
    margin-left: 60px;
  }
  .ant-row.ant-form-item {
    float: left;
    width: 50%;
  }
  .ant-form-item-required {
    float: left;
  }
  .addchapter {
    margin-top: 20px;
    margin-left: 120px;
    height: 50px;
  }
  .uploadchapter {
    margin-left: 640px;
    height: 50px;
    width: 150px;
    background-color: #00c8bb;
  }

  hr {
    width: 95%;
    margin-top: 40px;
  }

  .audio {
    margin-left: 50px;
    width: 600px;
    margin-top: 20px;
    margin-bottom: 15px;
    float: left;
  }
  .selectaudio {
    margin-left: 200px;
    margin-top: 25px;
  }
  .selectact {
    margin-left: 50px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .ant-select-selection.ant-select-selection--single {
    width: 150px;
    height: 40px;
    font-size: 17px;
  }
  .modalinput {
    margin-top: 20px;
  }
  .btn-submit {
    float: right;
    margin-right: 200px;
    margin-top: 12px;
    width: 100px;
    font-size: 16px;
  }

  .allbook h4 {
    margin-top: 25px;
  }

  .delete {
    margin-left: 30px;
    font-family: Arial;
  }
  .delete h4 {
    font-weight: bold;
    color: red;
    font-size: 16px;
  }
  #components-table-demo-drag-sorting tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  #components-table-demo-drag-sorting tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 11px;
  }
  .allbook {
    width: 95%;
    height: 240px;
    margin-top: 35px;
    font-family: Arial;
    margin-left: 30px;
  }
  .allbook h3 {
    font-weight: bold;
    color: #fda103;
  }
  .allbook h4 {
    font-weight: bold;
  }
  .allbook p {
    font-weight: normal;
  }
  .manager_synthesis {
    padding-left: 18px;
    height: 50%;
    border: 1px solid #ddd;
  }
  .manager_normalization {
    padding-left: 18px;
    height: 50%;
    border: 0.5px solid #ddd;
  }
  .manager_synthesis_left {
    float: left;
  }
  .manager_synthesis_right {
    margin-left: 400px;
    width: 60%;
  }
  .manager_normalization_left {
    float: left;
  }
  .manager_normalization_right {
    margin-left: 400px;
  }
  .manager_normalization_right button {
    background-color: #fdaf2f;
    color:white;
  }

`;

export { EditBookWapper };
