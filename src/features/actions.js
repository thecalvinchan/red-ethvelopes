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
