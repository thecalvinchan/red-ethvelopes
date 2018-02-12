import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { convertWeiToEther } from '../../helpers/EtherUnitConversionHelper';

class WithdrawEthvelope extends Component {
  constructor({ balance }) {
    super();
    this.state = {
      amount: balance,
      totalBalance: balance
    }
  }

  handleChange = (e) => {
    if (e.target.value <= this.state.totalBalance) {
      this.setState({amount: e.target.value});
    }
  }
  
  disabled() {
    return this.state.amount > this.state.totalBalance
  }

  render() {
    return (
      <div>
        <label htmlFor="value">Withdraw ETH from Ethvelope:</label>
				<div className="Ethvelope-form">
					<input name="value" value={convertWeiToEther(this.state.amount)} onChange={this.handleChange} placeholder={0.01}/>
					<button disabled={this.disabled()} onClick={this.props.withdrawEthvelope(this.state.amount)}>Withdraw</button>
				</div>
      </div>
    );
  }
}
WithdrawEthvelope.propTypes = {
  balance: PropTypes.number.isRequired,
  withdrawEthvelope: PropTypes.func.isRequired
}

export default WithdrawEthvelope;
