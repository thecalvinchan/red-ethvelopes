import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-flexbox-grid';

import { fetchRedEthvelopeContract } from './actions';

import './CreateAndSendEthvelope.css';

import { convertEtherToWei } from '../helpers/EtherUnitConversionHelper';

const STATUS_SENDING = 'SENDING';
const STATUS_READY = 'READY';
const STATUS_SUCCESS = 'SUCCESS';
const STATUS_ERROR = 'ERROR';

class CreateAndSendEthvelope extends Component {
  constructor() {
    super();
    this.state = {
      recipientAddress: '',
      amount: null,
      status: STATUS_READY,
      message: ''
    };
  }
  componentWillMount() {
    if (!this.props.redEthvelopeContract) {
      this.props.fetchRedEthvelopeContract();
    }
  }

  handleChangeRecipientAddress = (e) => {
    this.setState({recipientAddress: e.target.value});
  }

  handleChangeAmount = (e) => {
    this.setState({amount: e.target.value});
  }

  createAndSendEthvelope = async () => {
    const amount = convertEtherToWei(this.state.amount);
    try {
      this.setState({
        status: STATUS_SENDING
      });
      const tx = await this.props.redEthvelopeContract.createAndSendEthvelope(this.state.recipientAddress, {from: this.context.web3.selectedAccount, value: amount});
      this.setState({
        status: STATUS_SUCCESS,
        message: `Red Ethvelope successfully sent to ${this.state.recipientAddress}`
      });
      window.setTimeout(() => {
        this.setState({
          status: STATUS_READY,
          message: ''
        });
      }, 3000);
    } catch (e) {
      this.setState({
        status: STATUS_ERROR,
        message: e.message
      });
    }
  }
  
  renderFormForState() {
    switch(this.state.status) {
      case STATUS_READY: 
        return this.renderForm();
      case STATUS_SENDING: 
        return this.renderSending();
      case STATUS_ERROR: 
        return this.renderError();
      case STATUS_SUCCESS: 
        return this.renderSuccess();
      default:
        return null
    }
  }

  setStateToReady = (e) => {
    e.preventDefault();
    this.setState({
      status: STATUS_READY
    });
  }

  renderSending() {
    return (
      <div className="CreateAndSendEthvelope-form__sending">
        <p>Sending Red Ethvelope... (Something wrong? Click <a href="#" onClick={this.setStateToReady}>here</a> to try again.)</p>
      </div>
    )
  }

  renderSuccess() {
    return (
      <div className="CreateAndSendEthvelope-form__success">
        <p>{this.state.message}</p>
      </div>
    );
  }

  renderError() {
    return (
      <div className="CreateAndSendEthvelope-form__error">
        <p>Uh Oh, an error occured! Click <a href="#" onClick={this.setStateToReady}>here</a> to try again.</p>
      </div>
    );
  }

  renderForm() {
    return (
      <Grid className="CreateAndSendEthvelope-form">
				<Row>
					<Col xs={12}>
						<h2>Send someone a Red Ethvelope</h2>
					</Col>
					<br/>
					<Col xs={12} md={6} mdOffset={3}>
						<p>Chinese New Year is all about giving. Send your friends and family some Red Ethvelopes, the <a href="https://ethereum.org">Ethereum</a> equivalent of real-life Red Envelopes.</p>
					</Col>
				</Row>
				<br/>
        <Row>
          <Col xs={6} className="CreateAndSendEthvelope-label">
            <label htmlFor="address">Recipient Address:</label>
          </Col>
          <Col xs={6} className="CreateAndSendEthvelope-input">
            <input name="address" value={this.state.recipientAddress} onChange={this.handleChangeRecipientAddress} placeholder="0x627306090abaB3A6e1400e9345bC60c78a8BEf57"/>
          </Col>
        </Row>
        <Row>
          <Col xs={6} className="CreateAndSendEthvelope-label">
            <label htmlFor="amount">Amount ETH:</label>
          </Col>
          <Col xs={6} className="CreateAndSendEthvelope-input">
            <input name="amount" value={this.state.amount} onChange={this.handleChangeAmount} placeholder="0.01"/>
          </Col>
        </Row>
				<br/>
				<Row>
					<Col xs={10} xsOffset={1} md={6} mdOffset={3}>
					<button onClick={this.createAndSendEthvelope} className="btn__md btn__fullwidth">Send Ethvelope</button>
					</Col>
				</Row>
      </Grid>
    );
  }

  render () {
    return (
      <div className="CreateAndSendEthvelope">
				{this.renderFormForState()}
      </div>
    );
  }
}

CreateAndSendEthvelope.contextTypes = {
  web3: PropTypes.object
}

export default connect((state, ownProps) => {
  return {
    redEthvelopeContract: state.redEthvelopeContract,
  }
}, {
  fetchRedEthvelopeContract
})(CreateAndSendEthvelope);
