const networkConfig = {
	31337: {
		name: "localhost",
		ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
		gasLane:
			"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
		callbackGasLimit: "500000", // 500,000 gas
		mintFee: "10000000000000000", // 0.01 ETH
	},
	// Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
	11155111: {
		name: "sepolia",
		ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
		vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
		gasLane:
			"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
		callbackGasLimit: "500000", // 500,000 gas
		mintFee: "10000000000000000", // 0.01 ETH
		subscriptionId: "1391",
	},
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const MIN_DELAY = 3600;
const VOTING_PERIOD = 5;
const VOTING_DELAY = 5;
const QUORUM_PERCENTAGE = 4;
const NEW_STORE_VALUE = 77;
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box!";
const proposalsFile = "proposals.json";

module.exports = {
	networkConfig,
	developmentChains,
	VERIFICATION_BLOCK_CONFIRMATIONS,
	MIN_DELAY,
	VOTING_PERIOD,
	VOTING_DELAY,
	QUORUM_PERCENTAGE,
	NEW_STORE_VALUE,
	FUNC,
	PROPOSAL_DESCRIPTION,
	proposalsFile,
};
