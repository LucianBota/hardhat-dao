const { network } = require("hardhat");
const {
	developmentChains,
	MIN_DELAY,
	VOTING_DELAY,
	VOTING_PERIOD,
	QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log, get } = deployments;
	const { deployer } = await getNamedAccounts();
	const governanceToken = await get("GovernanceToken");
	const timeLock = await get("TimeLock");

	log("-----------------------");
	log("Deploying Governor Contract and waiting for confirmations...");
	const governorContract = await deploy("GovernorContract", {
		from: deployer,
		args: [
			governanceToken.address,
			timeLock.address,
			VOTING_DELAY,
			VOTING_PERIOD,
			QUORUM_PERCENTAGE,
		],
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
	log(`GovernorContract at ${governorContract.address}`);
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verifying...");
		await verify(governorContract.address, []);
	}
};
