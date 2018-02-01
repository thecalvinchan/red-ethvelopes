import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchRedEthvelopeContract } from '../actions';

import SendEthvelope from './SendEthvelope';
import WithdrawEthvelope from './WithdrawEthvelope';

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

  fetchEthvelope = async () => {
    const { id, redEthvelopeContract } = this.props;
    try {
      const balance = await redEthvelopeContract.tokenIdToWei.call(id);
      const metadataUrl = await redEthvelopeContract.tokenMetadata.call(id);
      this.setState({
        status: STATUS_FETCHED,
        balance: balance.toNumber(),
        metadataUrl: metadataUrl.toString()
      });
    } catch (e) {
      this.setState({
        status: STATUS_FAILURE,
        error: e
      });
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

  withdrawEthvelope = (amountInWei) => {
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
    const { redEthvelopeContract } = this.props;
    if (redEthvelopeContract !== null) {
      if (this.state.status === 'NOT_FETCHED') {
        this.fetchEthvelope();
        return (
          <h1>Loading</h1>
        )
      } else {
        return (
          <div>
            {this.state.balance} 
            {this.state.metadataUrl}
            {this.state.status}
            <SendEthvelope sendEthvelope={this.sendEthvelope} />
            <WithdrawEthvelope withdrawEthvelope={this.withdrawEthvelope} />
          </div>
        );
      }
    } else {
      return (
        <div>
          Ethvelope ID: {this.props.id} 
        </div>
      );
    }
  }
}

Ethvelope.contextTypes = {
  web3: PropTypes.object
}

export default connect((state, ownProps) => (
  {
    redEthvelopeContract: state.redEthvelopeContract,
    ...ownProps
  }
), {
  fetchRedEthvelopeContract
})(Ethvelope);
