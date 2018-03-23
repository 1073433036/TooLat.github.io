import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.scss';
// import LoginPage from './components/login-page/LoginPage'
// import HomePage from './components/home-page/HomePage'
// import ParentPage from './components/parent-page/ParentPage'
// import NewPage from './components/new-page/NewPage'
// import EggPage from './components/egg-page/EggPage'
import ReduxPage from './components/redux-page/ReduxPage'

const theFn = () => {
  alert(123)
}
const obj = {
  name: 'TooLate',
  // age: 18,
}
let job;

export default class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <LoginPage name="Bitch" theFn={ theFn } increment={ 5 } /> */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <HomePage isLoginIn={ false } /> */}
        {/* <ParentPage /> */}
        {/* <NewPage /> */}
        {/* <EggPage obj={ obj } func={ theFn } job={ job = 'worker' } /> */}
        <ReduxPage />
      </div>
    );
  }
}