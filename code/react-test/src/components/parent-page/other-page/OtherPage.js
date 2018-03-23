import React, { Component } from 'react'

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}

export default class OtherPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temperature: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    //this.setState({ temperature: e.target.value })
    this.props.onTemperatureChange(e.target.valu)
  }

  render() {
    const temperature = this.props.temperature
    const scale = this.props.scale
    return (
      <fieldset>
        {/* <legend>输入一个摄氏温度</legend> */}
        <legend>Enter temperature in { scaleNames[scale] }:</legend>
        <input value={ temperature } onChange={ this.handleChange } />
      </fieldset>
    )
  }
}