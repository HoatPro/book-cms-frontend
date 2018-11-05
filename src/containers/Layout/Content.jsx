import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import routes from '../App/routes';
import AddBook from '../AddBook/AddBook';
import Home from '../Home/Home';
import AddBookUI from '../AddBook/AddBookUI';
import EditBook from '../EditBook/EditBook';
import { ContentWrapper } from './Layout.style';

class Content extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <ContentWrapper>
            <Route exact path={routes.home} component={Home} />
            <Route path={routes.addbook} component={AddBook} />
            <Route path={routes.addbookui} component={AddBookUI} />
            <Route path={routes.editbook} component={EditBook} />
          </ContentWrapper>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Content;
