import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Ethvelope from './Ethvelope/Ethvelope';

import { fetchRedEthvelopeContract, fetchEthvelopes } from './actions';

class EthvelopeList extends Component {
  constructor() {
    super();
    this.state = {
      ethvelopes: null
    }
  }
  componentWillMount() {
    if (!this.props.redEthvelopeContract) {
      this.props.fetchRedEthvelopeContract();
    }
  }

  render() {
    const { redEthvelopeContract } = this.props;
    if (redEthvelopeContract !== null) {
      const { ethvelopes, selectedAccount, fetchEthvelopes } = this.props;
      const ethvelopesForAccount = ethvelopes[selectedAccount];
      if (ethvelopesForAccount === undefined) {
        fetchEthvelopes(redEthvelopeContract, this.context.web3.selectedAccount);
        return (
          <div>
            loading ethvelopes...
          </div>
        );
      } else if (ethvelopesForAccount.length <= 0) {
        return (
          <div>
            You have no ethvelopes.
          </div>
        );
      } else {
        return (
          <div>
            Ethvelopes
            { ethvelopesForAccount.map((ethvelopeId) => (
              <Ethvelope id={ethvelopeId.toNumber()} />
            ))}
          </div>
        );
      }
    } else {
      return (
        <div>
          Contract not loaded
        </div>
      );
    }
  }
}

EthvelopeList.contextTypes = {
  web3: PropTypes.object
}

export default connect((state, ownProps) => {
  return {
    redEthvelopeContract: state.redEthvelopeContract,
    ethvelopes: state.ethvelopes,
    selectedAccount: state.selectedAccount
  }
}, {
  fetchRedEthvelopeContract,
  fetchEthvelopes
})(EthvelopeList);
