// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
  enum Rarity { Standard, Rare, Legendary, Mythical}

  struct Athlete {
    string name;
    string teamName;
    string price;
    Rarity rarity;
    string perk1;
    string perk2;
    string perk3;
    string adjust;
  }

  Athlete[] private players;

  constructor () ERC721("PlayerCoin", "PC") Ownable() {}

  function createPlayer(string memory _name, string memory _teamName, string memory _price, Rarity _rarity, string memory _perk1, string memory _perk2, string memory _perk3) public onlyOwner returns (uint256) {
    Athlete memory athlete = Athlete({
        name: _name,
        teamName: _teamName,
        price: _price,
        rarity: _rarity,
        perk1: _perk1,
        perk2: _perk2,
        perk3: _perk3,
        adjust: ""
    });

    players.push(athlete);
    uint256 currentIndex = players.length - 1;
    _safeMint(msg.sender, currentIndex);
    return currentIndex;
  }

  function getPlayer(uint256 tokenID) public view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
    string memory rarityVal = "Standard";
    if (players[tokenID].rarity == Rarity.Rare) {
      rarityVal = "Rare";
    } else if (players[tokenID].rarity == Rarity.Legendary) {
      rarityVal = "Legendary";
    } else if (players[tokenID].rarity == Rarity.Mythical) {
      rarityVal = "Mythical";
    }

    return (players[tokenID].name, players[tokenID].teamName, players[tokenID].price, rarityVal, players[tokenID].perk1, players[tokenID].perk2, players[tokenID].perk3);
  }

  function setAdjust(uint256 tokenID, string memory _adjust) public onlyOwner {
    players[tokenID].adjust = _adjust;
  }

  function getAdjust(uint256 tokenID) public view returns (string memory) {
    return players[tokenID].adjust;
  }
}
