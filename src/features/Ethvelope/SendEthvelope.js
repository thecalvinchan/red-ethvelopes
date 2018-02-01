import React, { Component } from 'react';

class SendEthvelope extends Component {
  constructor() {
    super();
    this.state = {
      address: ''
    }
  }

  handleChange = (e) => {
    this.setState({address: e.target.value});
  }

  render() {
    return (
      <div>
        <label for="address">Recipient ETH Address:</label>
        <input name="address" value={this.state.address} onChange={this.handleChange}/>
        <button onClick={this.props.sendEthvelope(this.state.address)}>Send</button>
      </div>
    );
  }
}

export default SendEthvelope;
