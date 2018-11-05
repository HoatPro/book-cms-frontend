import React from 'react';
import PropTypes from 'prop-types';
import { LayoutWrapper } from './Layout.style';
import routes from '../App/routes';
import Header from './Header';
import Sider from './Sider';
import Content from './Content';
import Footer from './Footer';
class Layout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <LayoutWrapper>
        <div className="wrapper">
          <div className="header">
            <Header />
          </div>
          <div className="main_wrapper">
            <div className="sidebar">
              <Sider />
            </div>
            <div className="content">
              <Content>{children}</Content>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      </LayoutWrapper>
    );
  }
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
