var RedEthvelope = artifacts.require("./RedEthvelope");

module.exports = function(deployer) {
  deployer.deploy(RedEthvelope, 'http://localhost:8888', 999);
}
