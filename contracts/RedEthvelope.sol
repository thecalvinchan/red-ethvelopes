pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./vendors/solidity-stringutils/strings.sol";
// Uses OpenZeppelin wip ERC721 implementation
// https://github.com/OpenZeppelin/zeppelin-solidity/pull/683
import "./vendors/zeppelin-solidity/contracts/token/ERC721Token.sol";

contract ERC721Meta {
  function tokenMetadata(uint256 _tokenId) constant returns (string infoUrl);
}

contract RedEthvelope is ERC721Token, ERC721Meta, Ownable {
  using strings for *;

  // Cost for creating an ethvelope (taken by the contract)
  uint256 private costInWei;
  // Keeps track of ETH balance owner is allowed to withdraw
  uint256 private ownerBalance;
  // Keeps track of ETH balance in each ethvelope
  mapping(uint256 => uint256) tokenIdToWei;
  // Metadata Host URL for retrieving information about ethvelope
  slice private metadataHostUrl;
  // We don't really care about anything except the 8 bits representing an Ethvelope
  uint8[] public redEthvelopes;

  function changeCostInWei(uint256 _wei) public onlyOwner {
    costInWei = _wei;
  }

  function changeMetadataUrl(string _url) public onlyOwner {
    metadataHostUrl = _url.toSlice();
  }

  function RedEthvelope(string _url, uint256 _costInWei) public {
    changeMetadataUrl(_url);
    changeCostInWei(_costInWei);
  }

  // Withdraws wei as owner
  function withdrawAsOwner(uint256 _wei) public onlyOwner {
    require(_wei <= ownerBalance);
    ownerBalance -= _wei;
    msg.sender.transfer(_wei);
  }

  // Generates a random number from 0 to 256 based on the last block hash
  // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
  function randomGen(uint256 seed) constant returns (uint8 randomNumber) {
    return (uint8(sha3(block.blockhash(block.number-1), seed ))%256);
  } 

  function _createEthvelope(uint8 _dna, address _owner) private returns (uint256 ethvelopeId) {
    uint256 memory id = redEthvelopes.push(_dna) - 1;
    mint(_owner, id);
    return id;
  }

  // Ethvelopes are reusable. Therefore, owner of ethvelope can deposit more ETH if desired
  function deposit(uint256 _tokenId, uint256 _amountInWei) public onlyOwnerOf(_tokenId) {
    tokenIdToWei[_tokenId] += +_amountInWei;
  }

  function withdraw(uint256 _tokenId, uint256 _amountInWei) public onlyOwnerOf(_tokenId) {
    require(_amountInWei < tokenIdToWei[_tokenId]);
    tokenIdToWei[_tokenId] -= _amountInWei;
    msg.sender.transfer(_amountInWei);
  }

  function tokenMetadata(uint256 _tokenId) public view returns (string infoUrl) {
    return metadataHostUrl.concat(bytes32(redEthvelopes[_tokenId]));
  }

  function createAndSendEthvelope(address _to) public {
    // Sender must pay at least costInWei to send Ethvelope
    require(msg.value >= costInWei);
    // Cannot send Ethvelope to yourself
    require(msg.sender != _to);
    ownerBalance += costInWei;
    uint256 memory id = _createEthvelope(randomGen(msg.value), _to);
    // Deducts costInWei before depositing remaining balance into Ethvelope
    deposit(id, msg.value - costInWei);
    return tokenMetadata(id);
  }

}
