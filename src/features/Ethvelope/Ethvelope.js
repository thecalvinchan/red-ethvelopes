import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchRedEthvelopeContract, fetchEthvelope } from '../actions';

import './Ethvelope.css';

import SendEthvelope from './SendEthvelope';
import WithdrawEthvelope from './WithdrawEthvelope';

import { convertEtherToWei, convertWeiToEther } from '../../helpers/EtherUnitConversionHelper';

const STATUS_NOT_FETCHED = 'NOT_FETCHED';
const STATUS_FETCHED = 'FETCHED';
const STATUS_SENDING = 'SENDING';
const STATUS_FAILURE = 'FAILURE';
const STATUS_PROBABLY_SENT = 'PROBABLY_SENT';
const STATUS_PROBABLY_WITHDRAWN = 'PROBABLY_WITHDRAWN';

class Ethvelope extends Component {
  constructor() {
    super();
    this.state = {
      status: STATUS_NOT_FETCHED
    };
  }

  componentWillMount() {
    if (!this.props.redEthvelopeContract) {
      this.props.fetchRedEthvelopeContract();
    }
  }

  sendEthvelope = (toAddress) => {
    return async () => {
      const { id, redEthvelopeContract } = this.props;
      try {
        const tx = await redEthvelopeContract.transfer(toAddress, id, {from: this.context.web3.selectedAccount});
        this.setState({
          status: STATUS_PROBABLY_SENT,
          sentTo: toAddress
        });
      } catch (e) {
        this.setState({
          status: STATUS_FAILURE,
          error: e
        });
      }
    };
  }

  withdrawEthvelope = (amountInEth) => {
    const amountInWei = convertEtherToWei(amountInEth);
    return async () => { 
      try {
        const { id, redEthvelopeContract } = this.props;
        const tx = await redEthvelopeContract.withdraw(id, amountInWei, {from: this.context.web3.selectedAccount});
        this.setState({
          status: STATUS_PROBABLY_WITHDRAWN,
          amount: amountInWei
        });
      } catch (e) {
        this.setState({
          status: STATUS_FAILURE,
          error: e
        });
      }
    };
  }

  render() {
    const { redEthvelopeContract, ethvelope, id } = this.props;
    if (redEthvelopeContract !== null) {
      if (!ethvelope) {
        this.props.fetchEthvelope(redEthvelopeContract, id);
        return (
          <div>
            <h3>Loading</h3>
          </div>
        )
      } else {
        return (
          <div className="Ethvelope">
            <img className="Ethvelope-image" src={ethvelope.metadataUrl.toString()} />
            <br/>
            <div className="Ethvelope-actions">
							<p><strong>Balance:</strong> <code>{convertWeiToEther(ethvelope.balance.toNumber())} ETH</code></p>
							<br/>
              <SendEthvelope sendEthvelope={this.sendEthvelope} />
							<br/>
              <WithdrawEthvelope withdrawEthvelope={this.withdrawEthvelope} />
            </div>
          </div>
        );
      }
    } else {
      // This should never be reached
      return null;
    }
  }
}

Ethvelope.contextTypes = {
  web3: PropTypes.object
}

export default connect((state, ownProps) => (
  {
    redEthvelopeContract: state.redEthvelopeContract,
    ethvelope: state.ethvelopes[ownProps.id],
    ...ownProps
  }
), {
  fetchRedEthvelopeContract,
  fetchEthvelope
})(Ethvelope);
