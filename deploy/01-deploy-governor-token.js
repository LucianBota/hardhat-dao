const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	log("-----------------------");
	log("Deploying GovernanceToken and waiting for confirmations...");
	const governanceToken = await deploy("GovernanceToken", {
		from: deployer,
		args: [],
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
	log(`GovernanceToken at ${governanceToken.address}`);
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verifying...");
		await verify(governanceToken.address, []);
	}
	log(`Delegating to ${deployer}`);
	await delegate(governanceToken.address, deployer);
	log("Delegated!");
};

const delegate = async (governanceTokenAddress, delegatedAccount) => {
	const governanceToken = await ethers.getContractAt(
		"GovernanceToken",
		governanceTokenAddress
	);
	const transactionResponse = await governanceToken.delegate(delegatedAccount);
	await transactionResponse.wait(1);
	console.log(
		`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
	);
};
