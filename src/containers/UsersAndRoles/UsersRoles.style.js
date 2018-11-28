import styled from 'styled-components';

const UsersRolesWrapper = styled.div`
  margin-top: 50px;
  font-size: 2.5rem;
  .ant-breadcrumb a {
    font-size: 18px;
    color: #000;
    font-weight: 500;
  }
  .user_wrapper p {
    float: left;
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
    margin-left: 4px;
    padding-left: 20px;
  }

  .search {
    margin-top: 50px;
    margin-left: 200px;
    width: 40%;
  }
  .table_user {
    width: 95%;


  }
  .form_user_infomation {
    width: 50%;
  }

  h6 {
    font-size: 17px;
    /* color: rgba(0, 0, 0, 0.65); */
    font-weight: 430;
  }
  h5 {
    font-size: 18px;

  }
  li {
    font-size: 16px;
  }
  .tag {
    width: 350px;
    height: 40px;
    font-weight: 500;
    margin-top: 20px;
    padding-top: 30px;
    padding-left: 5px;
    color: #000;
  }
  .tag_info_user {
    width: 100px;
    height: 40px;
    float: left;
    font-size: 17px;
    margin-right: 100px;
  }
  .tag_role_user {
    margin-left: 100px;
    font-size: 17px;
  }
  .info_user {
    padding: 5px;
  }
  .info_user p {
    padding: 0px;
    font-weight: 500;
    font-size: 17px;
    color: #000;
  }
  .role_user p {
    padding: 5px;
    font-weight: 500;
    font-size: 17px;
    color: #000;
  }
  .role_detail_user {
    padding-left: 5px;
  }
  .delete_user {
    margin-bottom: 20px;
  }
`;

export { UsersRolesWrapper };
