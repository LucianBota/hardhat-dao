const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
	FUNC,
	NEW_STORE_VALUE,
	PROPOSAL_DESCRIPTION,
	developmentChains,
	VOTING_DELAY,
	proposalsFile,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const propose = async (args, functionToCall, proposalDescription) => {
	const governor = await ethers.getContract("GovernorContract");
	const box = await ethers.getContract("Box");
	const encodedFunctionCall = box.interface.encodeFunctionData(
		functionToCall,
		args
	);
	console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
	console.log(`Proposal Description: \n ${proposalDescription}`);
	const proposeTx = await governor.propose(
		[box.address],
		[0],
		[encodedFunctionCall],
		proposalDescription,
		{ gasLimit: 5000000 }
	);

	if (developmentChains.includes(network.name)) {
		await moveBlocks(VOTING_DELAY + 1);
	}
	const proposeReceipt = await proposeTx.wait(1);
	const proposalId = proposeReceipt.events[0].args.proposalId;
	console.log(`Proposed with proposal ID:\n  ${proposalId}`);

	let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
	proposals[network.config.chainId.toString()].push(proposalId.toString());
	fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
};

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = {
	propose,
};
