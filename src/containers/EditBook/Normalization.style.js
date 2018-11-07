import styled from 'styled-components';

const NormalizationWrapper = styled.div`
  margin-top: 10px;

  font-size: 2rem;
  font-weight: 700;
  .expand-row {
    width: 100%;
  }
  .ant-table-tbody tr {
    /* background-color:#ff9191 */
  }
  .description {
    width: 39%;
    height: 200px;
    float: left;
    font-weight: normal;
  }
  .edit-description {
    float: left;
    width: 30%;
    margin-left: 20px;
  }
  .edit-description input {
    float: left;
    width: 65%;
  }
  .edit-description button {
    margin-left: 10px;
  }
  .editable-row-operations icon-dex {
   margin-left:10px;
  }
`;

export { NormalizationWrapper };
