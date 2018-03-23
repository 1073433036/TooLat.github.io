import React, { Component } from 'react';

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      arr: ['too'],
      numbers: [1,3,5,7,9],
      value: '',
      isChecked: false,
      numberOfGuests: '',
    }
    this.log = this.log.bind(this)
    //this.handleChange = this.handleChange.bind(this)
  }

  log() {
    this.setState(prevState => ({
      isLoggedIn: !prevState.isLoggedIn
    }))
  }

  //表单 受控组件
  // handleChange(event) {
  //   this.setState({
  //     value: event.target.value
  //   })
  // }
  //多个表单输入
  changed(event) {
    console.log(event.target)
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  render() {
    // if (this.props.isLoginIn) {
    //   return (
    //     <div>已登录</div>
    //   )   
    // }
    // else {
    //   return (
    //     <div>未登录</div>
    //   )
    // }

    let button = null         //组件切换
    if(this.state.isLoggedIn)
      button = <div>开</div> 
    else
      button = <div>关</div>
    return (
      <main id="HomePage">
        { this.state.arr.length > 0 && <div>you cant see me</div> }   {/*条件渲染*/}
        { this.state.arr.length ? <div>arr is not null</div> : <div>arr is null</div> }
        <div onClick={ this.log }>开关</div>
        { button }

        <ul>{
          this.state.numbers.map(number => 
            <li key={ number }>{ number*2 }</li> 
          )
        }</ul>
        {/* <input type="text" value={ this.state.value } onChange={ this.handleChange } /> */}
        {/* <textarea value={ this.state.value } onChange={ this.handleChange } /> */}
        <input name="isChecked" type="checkbox" checked={ this.state.isChecked } onChange={ this.changed.bind(this) } />
        <input name="numberOfGuests" type="number" value={ this.state.numberOfGuests } onChange={ this.changed.bind(this) } />
      </main>
    )
  }
}