import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, Route } from "react-router-dom";
// import "./utils/fixed"

import Login from './pages/login/Login'
import Chat from './pages/chat/Chat'

const root = document.getElementById('root');

if (root !== null) {
  ReactDOM.render(
    <Router>
      <div className='index'>
        <Route exact path="/" component={Login} />  {/* 登录 */}
        <Route exact path="/chat" component={Chat} />  {/* 聊天 */}
      </div>
    </Router>,
    root
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
