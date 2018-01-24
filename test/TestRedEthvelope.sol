import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RedEthvelope.sol";

contract TestRedEthvelope {
  RedEthvelope redEthvelope;

  uint public initialbalance = 2 ether;

  function beforeEach() {
    redEthvelope = RedEthvelope(DeployedAddresses.RedEthvelope());
  }

  function testConstructor() {
    Assert.equal(redEthvelope.ownerBalance(), 0, "ownerbalance should be 0 initially");
    Assert.equal(redEthvelope.costInWei(), 999, "Cost In Wei should be 999 wei initially");
  }
}
