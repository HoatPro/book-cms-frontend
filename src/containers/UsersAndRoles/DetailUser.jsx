import React from 'react';
import { UsersRolesWrapper } from './UsersRoles.style';
import {
  Button,
  Checkbox,
  Row,
  Col,
  Tooltip,
  Icon,
  Breadcrumb,
  Modal,
  message,
} from 'antd';

import { Link } from 'react-router-dom';
import axios from 'axios';
const confirm = Modal.confirm;

class DetailUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserInfo: true,
      colorInfo: '#5ECCFF',
      colorRole: '#000',
      dataUser: [],
      features: [],
      checkedList: [],
      disableAdmin: false,
      disableManager: false,
      disableEditor: false,
    };
  }
  componentDidMount() {
    const userId = this.props.match.params.userId;
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/users/${userId}`,
      withCredentials: true,
    }).then(res => {
      if (res.status) {
        const dataUser = res.data.results;
        const roles = dataUser.roles;
        const features = roles[0].features;
        const roleName = roles[0].name;
        if (roleName === 'Admin') {
          this.setState({
            disableAdmin: false,
            disableManager: true,
            disableEditor: true,
          });
        } else if (roleName === 'Manager') {
          this.setState({
            disableAdmin: false,
            disableManager: false,
            disableEditor: true,
          });
        } else {
          this.setState({
            disableAdmin: false,
            disableManager: false,
            disableEditor: false,
          });
        }
        const defaultCheckedList = [`${roleName}`];
        this.setState({
          dataUser: dataUser,
          features: features,
          checkedList: defaultCheckedList,
        });
      }
    });
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v1/roles`,
      withCredentials: true,
    }).then(res => {
      const dataFeatures = res.data.results;
      this.setState({
        dataFeatures: dataFeatures,
      });
    });
  }
  handleDelete = () => {
    const userId = this.props.match.params.userId;
    confirm({
      title: 'Bạn có muốn xóa không?',
      content: (
        <div>
          <a>
            Thao tác này sẽ xóa toàn bộ quyền và thông tin người dùng ra khỏi hệ
            thống
          </a>
        </div>
      ),
      okType: 'danger',
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      onOk() {
        axios({
          method: 'DELETE',
          url: `http://localhost:8080/api/v1/users/${userId}`,
          withCredentials: true,
        }).then(response => {
          if (response.status) {
            message.success('Xóa người dùng thành công');
            let path = `/user-role`;
            this.props.history.push(path);
          }
        });
      },
      onCancel() {
        console.log('Hủy');
      },
    });
  };

  handleRole = () => {
    this.setState({
      showUserInfo: false,
      colorInfo: '#000',
      colorRole: '#5ECCFF',
    });
  };

  handleUserInfo = () => {
    this.setState({
      showUserInfo: true,
      colorInfo: '#5ECCFF',
      colorRole: '#000',
    });
  };
  //Thay đổi quyền user
  onChange = checkedList => {
    const dataFeatures = [...this.state.dataFeatures];
    if (checkedList.length === 0) {
      this.setState({
        disableAdmin: false,
        disableEditor: false,
        disableManager: false,
        features: [],
      });
    } else {
      checkedList.map(checked => {
        if (checked === 'Admin') {
          const featuresNew = dataFeatures.filter(
            item => item.name === 'Admin',
          );
          const listFeatures = featuresNew[0].features;
          this.setState({
            disableAdmin: false,
            disableManager: true,
            disableEditor: true,
            features: listFeatures,
          });
        } else if (checked === 'Manager') {
          const featuresNew = dataFeatures.filter(
            item => item.name === 'Manager',
          );
          const listFeatures = featuresNew[0].features;
          this.setState({
            disableAdmin: false,
            disableManager: false,
            disableEditor: true,
            features: listFeatures,
          });
        } else {
          const featuresNew = dataFeatures.filter(
            item => item.name === 'Editor',
          );
          const listFeatures = featuresNew[0].features;
          this.setState({
            disableAdmin: false,
            disableManager: false,
            disableEditor: false,
            features: listFeatures,
          });
        }
      });
    }
  };
  render() {
    const { dataUser, features } = this.state;
    const featuresUser = [];
    features.map((feature, index) => {
      featuresUser.push(<li key={index}>{feature.displayName}</li>);
    });

    let take = [];
    if (this.state.showUserInfo === true) {
      take = (
        <div className="info_user">
          <p>User Infomation</p>
          <hr />
          <div className="detail_user">
            <div>
              <h5>Name</h5>
              <h6>{dataUser.name}</h6>
            </div>
            <div>
              <h5>Email</h5>
              <h6>{dataUser.email}</h6>
            </div>
          </div>
          <hr />
          <div className="delete_user">
            <Button type="danger" onClick={this.handleDelete}>
              Delete User
            </Button>
          </div>
        </div>
      );
    } else {
      take = (
        <div className="role_user">
          <p>
            Role&nbsp;
            <Tooltip title="Phân quyền user trong hệ thống">
              <Icon type="question-circle-o" />
            </Tooltip>
          </p>
          <hr />
          <div className="role_detail_user">
            <Checkbox.Group
              style={{ width: '100%' }}
              onChange={this.onChange}
              defaultValue={this.state.checkedList}
            >
              <Row style={{ width: '100%' }}>
                <Col span={6}>
                  <Checkbox value="Legal" disabled={true}>
                    Legal
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Admin" disabled={this.state.disableAdmin}>
                    Admin
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value="Manager"
                    disabled={this.state.disableManager}
                  >
                    Manager
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="Editor" disabled={this.state.disableEditor}>
                    Editor
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            <h5 style={{ marginBottom: '-10px', marginTop: '10px' }}>
              Features
            </h5>
            <hr />
            <ul>{featuresUser}</ul>
          </div>
        </div>
      );
    }
    return (
      <UsersRolesWrapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/user-role">Uses and Roles</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Chi tiết thông tin User</Breadcrumb.Item>
        </Breadcrumb>
        <hr />
        <div className="info_user">
          <h5>{dataUser.name}</h5>
          <h6>{dataUser.email}</h6>
        </div>
        {/* phan chia components */}
        <div className="tag">
          <p
            onClick={this.handleUserInfo}
            className="tag_info_user"
            style={{ color: `${this.state.colorInfo}` }}
          >
            User Detail
          </p>
          <p
            onClick={this.handleRole}
            className="tag_role_user"
            style={{ color: `${this.state.colorRole}` }}
          >
            Role
          </p>
        </div>
        <hr />
        {take}
      </UsersRolesWrapper>
    );
  }
}

export default DetailUser;
