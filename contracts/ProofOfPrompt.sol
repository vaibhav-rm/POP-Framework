// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProofOfPrompt {
    struct Proof {
        address creator;
        string promptHash;
        string outputHash;
        uint256 timestamp;
        bool verified;
        bytes32 txHash; // Store transaction hash for reference
    }

    Proof[] private proofs;

    // Mapping to quickly check if a proof exists
    mapping(bytes32 => bool) private proofExists;

    // Mapping from creator to proof IDs
    mapping(address => uint256[]) private creatorToProofs;

    // Track unique creators
    address[] private uniqueCreators;
    mapping(address => bool) private creatorExists;

    event ProofRegistered(
        address indexed creator,
        string promptHash,
        string outputHash,
        uint256 timestamp,
        bytes32 txHash
    );

    /// Register a new proof
    function registerProof(string calldata promptHash, string calldata outputHash) external {
        bytes32 key = keccak256(abi.encodePacked(msg.sender, promptHash, outputHash));
        require(!proofExists[key], "Proof already exists");

        bytes32 txHash = keccak256(abi.encodePacked(block.number, msg.sender, promptHash, outputHash));

        proofs.push(Proof({
            creator: msg.sender,
            promptHash: promptHash,
            outputHash: outputHash,
            timestamp: block.timestamp,
            verified: true,
            txHash: txHash
        }));

        // Map proof to creator
        creatorToProofs[msg.sender].push(proofs.length - 1);

        // Track unique creators
        if (!creatorExists[msg.sender]) {
            uniqueCreators.push(msg.sender);
            creatorExists[msg.sender] = true;
        }

        proofExists[key] = true;

        emit ProofRegistered(msg.sender, promptHash, outputHash, block.timestamp, txHash);
    }

    /// Verify proof by creator, prompt hash, and output hash
    function verifyProof(
        address creator,
        string calldata promptHash,
        string calldata outputHash
    ) external view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(creator, promptHash, outputHash));
        return proofExists[key];
    }

    /// Verify proof by transaction hash
    function verifyProofByTx(bytes32 txHash) external view returns (bool) {
        for (uint256 i = 0; i < proofs.length; i++) {
            if (proofs[i].txHash == txHash) {
                return proofs[i].verified;
            }
        }
        return false;
    }

    /// Get all proofs
    function getAllProofs() external view returns (Proof[] memory) {
        return proofs;
    }

    /// Get proof count
    function getProofCount() external view returns (uint256) {
        return proofs.length;
    }

    /// Get unique creator count
    function getCreatorCount() external view returns (uint256) {
        return uniqueCreators.length;
    }

    /// Get proofs paginated
    function getProofsPaginated(uint256 offset, uint256 limit) external view returns (Proof[] memory) {
        require(offset < proofs.length, "Offset out of range");

        uint256 end = offset + limit;
        if (end > proofs.length) {
            end = proofs.length;
        }

        Proof[] memory result = new Proof[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = proofs[i];
        }
        return result;
    }

    /// Get proofs by creator
    function getProofsByCreator(address creator) external view returns (Proof[] memory) {
        uint256[] memory ids = creatorToProofs[creator];
        Proof[] memory result = new Proof[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = proofs[ids[i]];
        }
        return result;
    }

    /// Get proof by ID (index)
    function getProofById(uint256 id) external view returns (Proof memory) {
        require(id < proofs.length, "Proof ID out of range");
        return proofs[id];
    }
}
