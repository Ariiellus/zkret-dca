require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-toolbox');
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia_scroll: {
      url: process.env.SCROLL_RPC,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean)
    }
  },
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.SCROLL_ETHERSCAN_KEY // Assuming SCROLL_ETHERSCAN_KEY is your Etherscan API key for scrollSepolia network
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
    ],
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY // Assuming ETHERSCAN_API_KEY is the environment variable for Etherscan API key
    },
  },
  sourcify: {
    enabled: false, // Assuming you want Sourcify verification disabled
  }
};
