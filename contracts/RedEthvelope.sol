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

  string private metadataUrl;
  uint256 private costInWei;

  function RedEthvelope(string _url, uint256 _costInWei) public {
    metadataUrl = _url;
    costInWei = _costInWei;
  }

  function changeCostInWei(uint256 _wei) public onlyOwner {
    costInWei = _wei;
  }

  function changeMetadataUrl(string _url) public onlyOwner {
    metadataUrl = _url;
  }

  mapping(uint256 => uint256) tokenIdToWei;

  uint256 private ownerBalance;

  // Initially used an array of Structs but
  // We don't really care about anything except the 8 bits representing an Ethvelope
  uint8[] public redEthvelopes;

  // Generates a random number from 0 to 256 based on the last block hash
  // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
  function randomGen(uint256 seed) constant returns (uint8 randomNumber) {
    return (uint8(sha3(block.blockhash(block.number-1), seed ))%256);
  } 

  function _createEthvelope(uint8 _dna, address _owner) internal returns (uint256 ethvelopeId) {
    uint256 memory id = redEthvelopes.push(_dna) - 1;
    mint(_owner, id);
    return id;
  }

  function createAndSendEthvelope(address _to) public {
    require(msg.value >= costInWei);
    require(msg.sender != _to);
    ownerBalance += 1 finney;
    uint256 memory id = _createEthvelope(randomGen(msg.value), _to);
    deposit(id, msg.value - 1 finney);
    return tokenMetadata(id);
  }

  function deposit(uint256 _tokenId, uint256 _amountInWei) public onlyOwnerOf(_tokenId) {
    tokenIdToWei[_tokenId] += +_amountInWei;
  }

  function withdraw(uint256 _tokenId, uint256 _amountInWei) public onlyOwnerOf(_tokenId) {
    require(_amountInWei < tokenIdToWei[_tokenId]);
    tokenIdToWei[_tokenId] -= _amountInWei;
    msg.sender.transfer(_amountInWei);
  }

  function tokenMetadata(uint256 _tokenId) public view returns (string infoUrl) {
    return metadataUrl.toSlice().concat(bytes32(redEthvelopes[_tokenId]));
  }

}
