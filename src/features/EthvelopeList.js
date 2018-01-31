import React, { Component } from 'react';

import { connect } from 'react-redux';

class EthvelopeList extends Component {
  componentWillMount() {
    if (!this.props.redEthvelope) {
      this.props.fetchRedEthvelope();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  render () {
    if (this.props.redEthvelope) {
      console.log(this.props.redEthvelope.owner.call());
    }
    return (
      <div>
        hello
        {this.props.redEthvelope}
      </div>
    );
  }
}

const fetchRedEthvelope = () => ({
  type: 'CONTRACT_FETCH'
});

export default connect((state, ownProps) => {
  return {
    redEthvelope: state.redEthevelope,
    random: 1
  }
}, {
  fetchRedEthvelope
})(EthvelopeList);
