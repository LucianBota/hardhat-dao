const { network } = require("hardhat");
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	log("-----------------------");
	log("Deploying TimeLock and waiting for confirmations...");
	const timeLock = await deploy("TimeLock", {
		from: deployer,
		args: [MIN_DELAY, [], []],
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
	log(`TimeLock at ${timeLock.address}`);
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verifying...");
		await verify(timeLock.address, []);
	}
};
