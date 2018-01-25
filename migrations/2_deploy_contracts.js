var StringUtils = artifacts.require("./StringLib");
var RedEthvelope = artifacts.require("./RedEthvelope");

module.exports = function(deployer) {
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, RedEthvelope);
  deployer.deploy(RedEthvelope, 'http://localhost:8888/', 999);
}
