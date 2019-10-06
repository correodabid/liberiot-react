import React, { Component } from 'react';
import { Router } from 'react-router-dom';

import Routes from './routes';

import "./scss/index.scss";

import { History, createBrowserHistory } from "history";
import axiosInterceptor from "./utils/axiosInterceptor";

import { Provider } from 'mobx-react'
import RootStore from './stores'

const history: History = createBrowserHistory();

axiosInterceptor(history);

interface IProps {

}

interface IState {

}

class App extends Component<IProps, IState>{

  render() {
    return (
      <Provider {...RootStore}>
        <Router history={history}>
          <Routes />
        </Router>
      </Provider>
    );
  }
}

export default App;
