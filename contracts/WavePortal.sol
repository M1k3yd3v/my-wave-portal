// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 TotalWaves;
    mapping(address => uint256) waveCountMap;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    wave[] waves;
    mapping(address => uint256) public lastWavedAt;
    uint256 private seed;

    constructor() payable {
        console.log("yo yo ");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function Wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Must wait for 30 seconds before waving again!"
        );
        lastWavedAt[msg.sender] = block.timestamp;

        TotalWaves++;
        console.log("%s has waved", msg.sender);
        waveCountMap[msg.sender]++;
        waves.push(wave(msg.sender, _message, block.timestamp));

        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("random number generated ", seed);
        if (seed <= 50) {
            console.log("%s won", msg.sender);

            uint256 priceAmount = 0.0001 ether;
            require(
                priceAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: priceAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function GetTotalWaves() public view returns (uint256) {
        console.log("We have total of %d waves ", TotalWaves);
        return TotalWaves;
    }

    function getAllwaves() public view returns (wave[] memory) {
        return waves;
    }

    function GetWaveCountfromPerson(address addr)
        public
        view
        returns (uint256)
    {
        console.log(
            "Total waves %d from address %s ",
            waveCountMap[addr],
            addr
        );
        return waveCountMap[addr];
    }
}
