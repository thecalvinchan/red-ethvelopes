export const fetchRedEthvelopeContract = () => ({
  type: 'CONTRACT_FETCH'
});

export const fetchEthvelopes = (contract, account) => {
  return {
    type: 'FETCH_ETHVELOPES',
    contract,
    account
  }
};

export const fetchEthvelope = (contract, id) => {
  return {
    type: 'FETCH_ETHVELOPE',
    contract,
    id
  }
};
