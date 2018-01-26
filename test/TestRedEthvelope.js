const RedEthvelope = artifacts.require('RedEthvelope');

const finney = 1e15;

contract('RedEthvelope', async (accounts) => {
	const owner = accounts[0];
	const recipient = accounts[1];
	let redEthvelope = await RedEthvelope.deployed();;

  context('contract creation', () => {
    it('should have an owner balance of zero', async () => {
      const ownerBalance = await redEthvelope.ownerBalance.call();
      assert.equal(ownerBalance.toNumber(), 0, 'Owner balance is 0');
    });

    it('should have a cost in wei of 1 finney', async () => {
      const costInWei = await redEthvelope.costInWei.call();
      assert.equal(costInWei.toNumber(), finney, 'Cost in wei is 1 finney');
    });
  });

  context('changing contract details', () => {
    context('as contract owner', () => {
      it('should allow owner to change costInWei', async () => {
        await redEthvelope.changeCostInWei(1, {from: owner});
        const costInWei = await redEthvelope.costInWei.call();
        assert.equal(costInWei.toNumber(), 1, 'Cost in wei is 1 wei.');
      });
      it('should allow owner to change metadataUrl', async () => {
        await redEthvelope.changeMetadataUrl('http://127.0.0.1:1234/', {from: owner});
        const metadataHostUrl = await redEthvelope.metadataHostUrl.call();
        assert.equal(metadataHostUrl.toString(), 'http://127.0.0.1:1234/', 'metadataHostUrl is changed');
      });
    });
    context('not as contract owner', () => {
      it('should not allow user to change costInWei', async () => {
        await expectError(redEthvelope.changeCostInWei(1, {from: recipient}));
      });
      it('should not allow user to change metadataUrl', async () => {
        await expectError(redEthvelope.changeMetadataUrl('http://127.0.0.1:1234', {from: recipient}));
      });
    });
  });

  context('sending ethvelopes', () => {
    beforeEach(async () => {
      await redEthvelope.createAndSendEthvelope(recipient, {from: owner, value: 2*finney});
    });

    it('should allow users to send ethvelopes correctly', async () => {
      const ownerBalancePromise = redEthvelope.ownerBalance.call();
      const tokenBalancePromise = redEthvelope.tokenIdToWei.call(0);
      const [ownerBalance, tokenBalance] = await Promise.all([ownerBalancePromise, tokenBalancePromise]);
      assert.equal(ownerBalance.toNumber(), 1, 'Owner takes 1 wei commission');
      assert.equal(tokenBalance.toNumber(), 2*finney - 1, 'Recipient receives difference from original transaction');
    });

    it('should return tokenMetadata correctly', async () => {
      const tokenMetadataPromise = redEthvelope.tokenMetadata.call(0);
      const tokenDnaPromise = redEthvelope.redEthvelopes.call(0);
      const [tokenMetadata, tokenDna] = await Promise.all([tokenMetadataPromise, tokenDnaPromise]);
      assert.equal(tokenMetadata.toString(), `http://127.0.0.1:1234/${tokenDna}`);
    });
  });

	context('withdrawals', () => {
		it('allows ethvelope owners to withdraw funds', async () => {
			await redEthvelope.withdraw(0, 4000, {from: recipient});
		});

		it('does not allow ethvelope owners withdraw more funds than in ethvelope', async () => {
			await expectError(redEthvelope.withdraw(0, 2*finney, {from: recipient}));
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
