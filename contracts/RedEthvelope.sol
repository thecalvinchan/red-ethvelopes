pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./vendors/ethereum-string-utils/contracts/StringLib.sol";
// Uses OpenZeppelin wip ERC721 implementation
// https://github.com/OpenZeppelin/zeppelin-solidity/pull/683
import "./vendors/zeppelin-solidity/contracts/token/ERC721Token.sol";

contract ERC721Meta {
  function tokenMetadata(uint256 _tokenId) public view returns (string infoUrl);
}

// Modified from https://github.com/Arachnid/solidity-stringutils
library strings {
  struct slice {
      uint _len;
      uint _ptr;
  }
  function memcpy(uint dest, uint src, uint len) private pure {
      // Copy word-length chunks while possible
      for(; len >= 32; len -= 32) {
          assembly {
              mstore(dest, mload(src))
          }
          dest += 32;
          src += 32;
      }

      // Copy remaining bytes
      uint mask = 256 ** (32 - len) - 1;
      assembly {
          let srcpart := and(mload(src), not(mask))
          let destpart := and(mload(dest), mask)
          mstore(dest, or(destpart, srcpart))
      }
  }
  /*
   * @dev Returns the length of a null-terminated bytes32 string.
   * @param self The value to find the length of.
   * @return The length of the string, from 0 to 32.
   */
  function len(bytes32 self) internal pure returns (uint) {
      uint ret;
      if (self == 0)
          return 0;
      if (self & 0xffffffffffffffffffffffffffffffff == 0) {
          ret += 16;
          self = bytes32(uint(self) / 0x100000000000000000000000000000000);
      }
      if (self & 0xffffffffffffffff == 0) {
          ret += 8;
          self = bytes32(uint(self) / 0x10000000000000000);
      }
      if (self & 0xffffffff == 0) {
          ret += 4;
          self = bytes32(uint(self) / 0x100000000);
      }
      if (self & 0xffff == 0) {
          ret += 2;
          self = bytes32(uint(self) / 0x10000);
      }
      if (self & 0xff == 0) {
          ret += 1;
      }
      return 32 - ret;
  }
  /*
   * @dev Returns a slice containing the entire string.
   * @param self The string to make a slice from.
   * @return A newly allocated slice containing the entire string.
   */
  function toSlice(string self) internal pure returns (slice) {
      uint ptr;
      assembly {
          ptr := add(self, 0x20)
      }
      return slice(bytes(self).length, ptr);
  }
  /*
   * @dev Returns a slice containing the entire bytes32, interpreted as a
   *      null-termintaed utf-8 string.
   * @param self The bytes32 value to convert to a slice.
   * @return A new slice containing the value of the input argument up to the
   *         first null.
   */
  function toSliceB32(bytes32 self) internal pure returns (slice ret) {
      // Allocate space for `self` in memory, copy it there, and point ret at it
      assembly {
          let ptr := mload(0x40)
          mstore(0x40, add(ptr, 0x20))
          mstore(ptr, self)
          mstore(add(ret, 0x20), ptr)
      }
      ret._len = len(self);
  }
  /*
   * @dev Returns a newly allocated string containing the concatenation of
   *      `self` and `other`.
   * @param self The first slice to concatenate.
   * @param other The second slice to concatenate.
   * @return The concatenation of the two strings.
   */
  function concat(slice self, slice other) internal pure returns (string) {
      var ret = new string(self._len + other._len);
      uint retptr;
      assembly { retptr := add(ret, 32) }
      memcpy(retptr, self._ptr, self._len);
      memcpy(retptr + self._len, other._ptr, other._len);
      return ret;
  }
}

contract RedEthvelope is ERC721Token, ERC721Meta, Ownable {
  using strings for *;

  // Cost for creating an ethvelope (taken by the contract)
  uint256 public costInWei = 0;
  // Keeps track of ETH balance owner is allowed to withdraw
  uint256 public ownerBalance = 0;
  // Keeps track of ETH balance in each ethvelope
  mapping(uint256 => uint256) public tokenIdToWei;
  // Metadata Host URL for retrieving information about ethvelope
  string public metadataHostUrl;
  // We don't really care about anything except the 8 bits representing an Ethvelope
  uint8[] public redEthvelopes;

  function changeCostInWei(uint256 _wei) public onlyOwner {
    costInWei = _wei;
  }

  function changeMetadataUrl(string _url) public onlyOwner {
    metadataHostUrl = _url;
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
  function randomGen(uint256 seed) private view returns (uint8 randomNumber) {
    return uint8(uint8(keccak256(block.blockhash(block.number-1), seed ))%256);
  } 

  function _createEthvelope(uint8 _dna, address _owner) private returns (uint256 ethvelopeId) {
    uint256 id = redEthvelopes.push(_dna) - 1;
    mint(_owner, id);
    return id;
  }

  function _deposit(uint256 _tokenId, uint256 _amountInWei) private {
    tokenIdToWei[_tokenId] = tokenIdToWei[_tokenId] + _amountInWei;
  }

  function withdraw(uint256 _tokenId, uint256 _amountInWei) public onlyOwnerOf(_tokenId) {
    require(_amountInWei < tokenIdToWei[_tokenId]);
    tokenIdToWei[_tokenId] -= _amountInWei;
    msg.sender.transfer(_amountInWei);
  }

  function tokenMetadata(uint256 _tokenId) public view returns (string infoUrl) {
    return metadataHostUrl.toSlice().concat(StringLib.uintToBytes(redEthvelopes[_tokenId]).toSliceB32());
  }

  event EthvelopeCreatedAndSent(address _to);

  function createAndSendEthvelope(address _to) public payable {
    // Sender must pay at least costInWei to send Ethvelope
    require(msg.value >= costInWei);
    // Cannot send Ethvelope to yourself
    require(msg.sender != _to);
    ownerBalance += costInWei;
    uint256 id = _createEthvelope(randomGen(msg.value), _to);
    // Deducts costInWei before depositing remaining balance into Ethvelope
    _deposit(id, msg.value - costInWei);
    EthvelopeCreatedAndSent(_to);
  }

  // Ethvelopes are reusable. Therefore, owner of ethvelope can deposit more ETH if desired
  function deposit(uint256 _tokenId) public payable onlyOwnerOf(_tokenId) {
    // Sender must pay at least costInWei to deposit into Ethvelope
    require(msg.value >= costInWei);
    ownerBalance += costInWei;
    _deposit(_tokenId, msg.value - costInWei);
  }

}
