import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import routes from './routes';

import Layout from '../Layout/Layout';
import ManagerBook from '../ManagerBook/ManagerBook';
import AddBook from '../AddBook/AddBook';
import AddBookUI from '../AddBook/AddBookUI';
import EditBook from '../EditBook/EditBook';
import Login from '../Login/Login';
import Register from '../Register/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.login} component={Login} />
        <Route exact path={routes.register} component={Register} />
        <Layout>
          <Route exact path={routes.managerBook} component={ManagerBook} />
          <Route path={routes.addbook} component={AddBook} />
          <Route path={routes.addbookui} component={AddBookUI} />
          <Route path={routes.editbook} component={EditBook} />
        </Layout>
      </Switch>
    </BrowserRouter>
  );
}
