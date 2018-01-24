const RedEthvelope = artifacts.require('RedEthvelope');

contract('RedEthvelope', (accounts) => {
  it('should allow users to send ethvelopes correctly', () => {
    const owner = accounts[0];
    const recipient = accounts[1];

    let redEthvelope;

    return RedEthvelope.deployed().then((instance) => {
      redEthvelope = instance;
      return redEthvelope.createAndSendEthvelope(recipient, {from: owner, value: 9999});
    }).then(() => {
      return redEthvelope.ownerBalance();
    }).then((ownerBalance) => {
      assert.equal(ownerBalance, 999, 'Owner takes 999 commission');
      return redEthvelope.tokenIdToWei(0);
    }).then((tokenBalance) => {
      assert.equal(tokenBalance, 9000, 'Recipient receives 9000 from original transaction');
    });
  });
  it('should return tokenMetadata correctly', () => {
    const owner = accounts[0];
    const recipient = accounts[1];
    let redEthvelope;

    return RedEthvelope.deployed().then((instance) => {
      redEthvelope = instance;
      return redEthvelope.createAndSendEthvelope(recipient, {from: owner, value: 9999});
    }).then(() => {
      return redEthvelope.tokenMetadata(0);
    }).then((tokenMetadata) => {
      console.log(tokenMetadata);
    });
  });
})
