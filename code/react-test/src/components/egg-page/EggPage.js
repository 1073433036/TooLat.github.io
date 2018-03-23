import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class EggPage extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <main>
        <div onClick={ this.props.func }>{ this.props.obj.name }</div>
        <div>{ this.props.obj.age }</div>
        <div>{ this.props.job }</div>
      </main>
    )
  }
}

EggPage.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.number
  }),
  func: PropTypes.func.isRequired,
  job: PropTypes.string,
}
