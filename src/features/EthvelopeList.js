import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-flexbox-grid';

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
      const { accountEthvelopes, selectedAccount, fetchEthvelopes } = this.props;
      const ethvelopesForAccount = accountEthvelopes[selectedAccount];
      if (ethvelopesForAccount === undefined) {
        fetchEthvelopes(redEthvelopeContract, this.context.web3.selectedAccount);
        return (
          <div>
            Loading Ethvelopes...
          </div>
        );
      } else if (ethvelopesForAccount.length <= 0) {
        return (
          <div>
            <h2>You have no ethvelopes</h2>
          </div>
        );
      } else {
        return (
          <Grid>
						<Row>
							<Col xs={12}>
								<h2>Your Ethvelopes</h2>
							</Col>
							<Col xs={12} md={10} mdOffset={1}>
								<p>There are different kinds of unique Red Ethvelope designs, and which design you get is completely random! Some are more rare than others, though, so send more Red Ethvelopes to help your friends and family collect them all! Each Red Ethvelope is an ERC-721 compliant token, which means you can also trade with others.</p>
							</Col>
						</Row>
						<br/>
            <Row>
              { ethvelopesForAccount.map((ethvelopeId) => (
                <Col xs={12} md={4} key={ethvelopeId}>
                  <Ethvelope id={ethvelopeId.toNumber()} />
                </Col>
              ))}
            </Row>
          </Grid>
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
    accountEthvelopes: state.accountEthvelopes,
    selectedAccount: state.selectedAccount
  }
}, {
  fetchRedEthvelopeContract,
  fetchEthvelopes
})(EthvelopeList);
