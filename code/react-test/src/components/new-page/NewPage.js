import React, { Component } from 'react';
//组合

function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function Contacts() {
  return (
    <div>Contacts</div>
  )
}

function Chat() {
  return (
    <div>Chat</div>
  )
}

export default class NewPage extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <main>
        <FancyBorder color="blue">
          <h1 className="Dialog-title">
            Welcome
          </h1>
          <p className="Dialog-message">
            Thank you for visiting our spacecraft!
          </p>
        </FancyBorder>
        <SplitPane
          left={
            <Contacts />
          }
          right={
            <Chat />
          } />
      </main>
    )
  }
}