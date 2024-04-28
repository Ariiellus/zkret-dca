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
    apiKey: process.env.SCROLL_ETHERSCAN_KEY
  }
};
