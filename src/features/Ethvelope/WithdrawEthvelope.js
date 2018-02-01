import React, { Component } from 'react';

class WithdrawEthvelope extends Component {
  constructor() {
    super();
    this.state = {
      amount: ''
    }
  }

  handleChange = (e) => {
    this.setState({amount: e.target.value});
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <label for="value">Amount ETH to withdraw (in wei):</label>
        <input name="value" value={this.state.amount} onChange={this.handleChange}/>
        <button onClick={this.props.withdrawEthvelope(this.state.amount)}>Withdraw</button>
      </div>
    );
  }
}

export default WithdrawEthvelope;
