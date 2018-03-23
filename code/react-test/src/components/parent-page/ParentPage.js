import React, { Component } from 'react'
import OtherPage from './other-page/OtherPage'
import ChildPage from './child-page/ChildPage'

class BoilingVerdict extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <p>{ this.props.celsius >= 100 ? '水会烧开' : '水不会烧开' }</p>
    )
  }
}

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

export default class ParentPage extends Component {
  constructor(props) {
    super(props)
    this.state = {temperature: '', scale: 'c'};
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return(
      <main>
        <div>123</div>
        <OtherPage scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
        <OtherPage scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict celsius={ parseFloat(temperature) } />
        <ChildPage />
      </main>
    )
  }
}