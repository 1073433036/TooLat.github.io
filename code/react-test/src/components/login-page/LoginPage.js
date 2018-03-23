import React, { Component } from 'react';
import './LoginPage.scss';

const fn = () => {
  alert('hi bitch')
}

// const LoginPage = props => (
//   <main id="loginPage">
//     <span onClick={ fn }>{ props.name }</span>
//   </main>
// )
// export default LoginPage

export default class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      counter: 10,
    }

    // This binding is necessary to make `this` work in the callback
    this.addCounter = this.addCounter.bind(this)
    // this.addCounter = this.addCounter.call(this)   //error
  }

  tick() {
    this.setState({
      date: new Date()
    })
  }

  // addCounter = () => {
  //   this.setState((prevState, props) => ({
  //     counter: prevState.counter + props.increment
  //   }))
  // }
  addCounter() {
    // 类的方法默认是不会绑定 this 的
    this.setState((prevState, props) => ({
      counter: prevState.counter + props.increment
    }))
  }

  handleClick(e) {
    e.preventDefault()      //阻止默认行为
    console.log('The link was clicked.')
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <main id="loginPage">
        <span onClick={ fn }>{ this.props.name }</span>
        <div onClick={ this.props.theFn }>lalala</div>
        <div>{ this.state.date.getSeconds() }</div>
        <div onClick={ this.addCounter }>{ this.state.counter }</div>
        <a href="#" onClick={ this.handleClick }>click me</a>
      </main>
    );
  }
}