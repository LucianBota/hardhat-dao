const { network, ethers } = require("hardhat");
const fs = require("fs");
const {
	proposalsFile,
	VOTING_PERIOD,
	developmentChains,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");
const index = 0;

const main = async (proposalIndex) => {
	const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
	// You could swap this out for the ID you want to use too
	const proposalId = proposals[network.config.chainId][proposalIndex];
	// 0 = Against, 1 = For, 2 = Abstain for this example
	const voteWay = 1;
	const reason = "Becoming the Hokage doesn't mean people will acknowledge you";
	await vote(proposalId, voteWay, reason);
};

// 0 = Against, 1 = For, 2 = Abstain for this example
const vote = async (proposalId, voteWay, reason) => {
	console.log("Voting...");
	const governor = await ethers.getContract("GovernorContract");
	const voteTx = await governor.castVoteWithReason(
		proposalId,
		voteWay,
		reason,
		{ gasLimit: 5000000 }
	);
	const voteTxReceipt = await voteTx.wait(1);
	console.log(voteTxReceipt.events[0].args.reason);
	const proposalState = await governor.state(proposalId);
	console.log(`Current Proposal State: ${proposalState}`);
	if (developmentChains.includes(network.name)) {
		await moveBlocks(VOTING_PERIOD + 1);
	}
};

main(index)
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = {
	vote,
};
