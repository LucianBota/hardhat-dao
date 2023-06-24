const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	log("-----------------------");
	log("Deploying Box and waiting for confirmations...");
	const box = await deploy("Box", {
		from: deployer,
		args: [],
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
	log(`Box at ${box.address}`);
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verifying...");
		await verify(box.address, []);
	}
	const timeLock = await ethers.getContract("TimeLock");
	const boxContract = await ethers.getContractAt("Box", box.address);
	const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
	await transferOwnerTx.wait(1);
	log("Ownership transferred!");
};
