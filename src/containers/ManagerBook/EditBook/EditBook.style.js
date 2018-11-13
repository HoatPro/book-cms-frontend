import styled from 'styled-components';

const EditBookWapper = styled.div`
  margin-top: 10px;
  font-family: Arial;
  .ant-breadcrumb a {
    font-size: 18px;
    color: black;
    font-weight: bold;
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
    height: 700px;
    padding-left: 100px;
    margin-left: 60px;
  }
   .btn-submit {
    float: left;
    margin-top:170px;
    margin-left:170px;
    width:100px;
    font-size: 16px;
  }
  .ant-form-item-label.ant-col-xs-24.ant-col-sm-18 label {
    float: left;
  }
  .ant-row.ant-form-item {
    float: left;
    width: 50%;
  }
  .ant-form-item-required {
    float: left;
    font-size: 16px;
  }
  .ant-spin-container{
    width:96%;
    padding-left:56px;
  }
  .addchapter {
    margin-top: 20px;
    margin-left: 120px;
    height: 50px;
  }
  .uploadchapter {
    margin-left: 640px;
    height: 50px;
    width: 140px;
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
    margin-left: 56px;
    margin-top: 15px;
    margin-bottom: 15px;
    color: #40a9ff;
  }

  .modalinput {
    margin-top: 20px;
  }


  .allbook h4 {
    margin-top: 25px;
  }

  .delete {
    margin-left: 30px;
    margin-bottom:20px;
    font-family: Arial;
  }
  .delete h4 {
    font-weight: bold;
    color: red;
    font-size: 16px;
  }
  /* #components-table-demo-drag-sorting tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  #components-table-demo-drag-sorting tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  } */
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
    height: 600px;
    margin-top: 35px;
    font-family: Arial;
    margin-left: 30px;
  }
  .allbook h3 {
    font-weight: bold;
    color: #fda103;
  }
  .allbook h4 {
    margin-top:31px;
    font-weight: bold;
  }
  .allbook p {
    font-weight: normal;
  }
  .manager_synthesis {
    padding-left: 18px;
    height: 78%;
    border: 1px solid #ddd;
    border-bottom:none;
  }
  .manager_normalization {
    padding-left: 18px;
    height: 22%;
    border: 0.5px solid #ddd;
  }
  .manager_synthesis_left {
    float: left;
  }
  .manager_synthesis_right {
    margin-left: 250px;
    width: 75%;
  }
   .manager_synthesis_right button{
     margin-bottom:15px;
   }
  .manager_normalization_left {
    float: left;
  }
  .manager_normalization_right {
    margin-left: 250px;
  }
  .manager_normalization_right button {
    background-color: #fdaf2f;
    color: white;
  }
`;

export { EditBookWapper };