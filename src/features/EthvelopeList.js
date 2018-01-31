import React, { Component } from 'react';

import { connect } from 'react-redux';

class EthvelopeList extends Component {
  componentWillMount() {
    if (!this.props.redEthvelope) {
      this.props.fetchRedEthvelope();
    }
    console.log(!this.props.redEthvelope);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  render () {
    return (
      <div>
        hello
      </div>
    );
  }
}

const fetchRedEthvelope = () => ({
  type: 'CONTRACT_FETCH'
});

export default connect((state, ownProps) => {
  return {
    redEthvelope: state.redEthvelope,
    random: 1
  }
}, {
  fetchRedEthvelope
})(EthvelopeList);
