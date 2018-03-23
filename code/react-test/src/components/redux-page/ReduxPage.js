import React, { Component } from 'react'
import { createStore } from 'redux'

const fn = () => {
  console.log(123)
}
const store = createStore(fn)
console.log(store)

const state = store.getState()
console.log(state)

const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'  
}

export default class ReduxPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <main id="reduxPage">
        123
      </main>
    )
  }
}