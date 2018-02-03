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
        <label htmlFor="value">Withdraw ETH from Ethvelope:</label>
				<div className="Ethvelope-form">
					<input name="value" value={this.state.amount} onChange={this.handleChange} placeholder={0.01}/>
					<button onClick={this.props.withdrawEthvelope(this.state.amount)}>Withdraw</button>
				</div>
      </div>
    );
  }
}

export default WithdrawEthvelope;
