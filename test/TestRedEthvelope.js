const RedEthvelope = artifacts.require('RedEthvelope');

contract('RedEthvelope', (accounts) => {
	const owner = accounts[0];
	const recipient = accounts[1];
	let redEthvelope;

	beforeEach(async () => {
    redEthvelope = await RedEthvelope.deployed();
    await redEthvelope.createAndSendEthvelope(recipient, {from: owner, value: 9999});
	});

  it('should allow users to send ethvelopes correctly', async () => {
    const ownerBalancePromise = redEthvelope.ownerBalance.call();
    const tokenBalancePromise = redEthvelope.tokenIdToWei.call(0);
		const [ownerBalance, tokenBalance] = await Promise.all([ownerBalancePromise, tokenBalancePromise]);
    assert.equal(ownerBalance, 999, 'Owner takes 999 commission');
		assert.equal(tokenBalance, 9000, 'Recipient receives 9000 from original transaction');
  });

  it('should return tokenMetadata correctly', async () => {
		const tokenMetadataPromise = redEthvelope.tokenMetadata.call(0);
		const tokenDnaPromise = redEthvelope.redEthvelopes.call(0);
		const [tokenMetadata, tokenDna] = await Promise.all([tokenMetadataPromise, tokenDnaPromise]);
		assert.equal(tokenMetadata, `http://localhost:8888/${tokenDna}`);
  });

	context('withdrawals', () => {
		it('allows ethvelope owners to withdraw funds', async () => {
			await redEthvelope.withdraw(0, 4000, {from: recipient});
		});

		it('does not allow ethvelope owners withdraw more funds than in ethvelope', async () => {
			await expectError(redEthvelope.withdraw(0, 9999, {from: recipient}));
		});

		it('does not allow accounts to withdraw funds from ethvelopes they do not own', async () => {
			await expectError(redEthvelope.withdraw(0, 9999, {from: owner}));
		});
	});
})

async function expectError(promise) {
	try {
		await promise;
	} catch(error) {
		const revert = error.message.search('revert') >= 1;
		const invalidOpcode = error.message.search('invalid opcode') >= 0;
		const outOfGas = error.message.search('out of gas') >= 0;
		assert(
			invalidOpcode || outOfGas || revert,
			'Expected throw, got \'' + error + '\' instead'
		);
		return;
	}
	assert.fail('Expected throw not received');
}
