const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { log } = deployments;
	const { deployer } = await getNamedAccounts();
	const timeLock = await ethers.getContract("TimeLock", deployer);
	const governor = await ethers.getContract("GovernorContract", deployer);

	log("Setting up contracts for roles...");
	const proposerRole = await timeLock.PROPOSER_ROLE();
	const executorRole = await timeLock.EXECUTOR_ROLE();
	const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

	const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
	await proposerTx.wait(1);
	const executorTx = await timeLock.grantRole(
		executorRole,
		ethers.constants.AddressZero
	);
	await executorTx.wait(1);
	const revokeTx = await timeLock.revokeRole(adminRole, deployer);
	await revokeTx.wait(1);
};
