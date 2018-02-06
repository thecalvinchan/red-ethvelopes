import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

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
        <label htmlFor="address" data-tip='You can send an ethvelope (along with all of its ETH funds) to another address.'>Send Ethvelope</label>
        <ReactTooltip/>
        <br/>
				<div className="Ethvelope-form">
					<input name="address" value={this.state.address} onChange={this.handleChange} placeholder="0x627306090abaB3A6e1400e9345bC60c78a8BEf57"/>
					<button onClick={this.props.sendEthvelope(this.state.address)}>Send</button>
				</div>
      </div>
    );
  }
}

export default SendEthvelope;
