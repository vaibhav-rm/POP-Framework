// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofOfPrompt {
    struct Proof {
        string promptHash;
        string outputHash;
        uint256 timestamp;
        address creator;
    }

    mapping(bytes32 => Proof) public proofs;

    event ProofRegistered(bytes32 indexed id, string promptHash, string outputHash, address creator, uint256 timestamp);

    function registerProof(string memory promptHash, string memory outputHash) public {
        bytes32 id = keccak256(abi.encodePacked(promptHash, outputHash, msg.sender));
        require(proofs[id].timestamp == 0, "Proof already exists");

        proofs[id] = Proof(promptHash, outputHash, block.timestamp, msg.sender);
        emit ProofRegistered(id, promptHash, outputHash, msg.sender, block.timestamp);
    }

    function verifyProof(string memory promptHash, string memory outputHash, address creator)
        public view returns (bool)
    {
        bytes32 id = keccak256(abi.encodePacked(promptHash, outputHash, creator));
        return proofs[id].timestamp != 0;
    }
}

