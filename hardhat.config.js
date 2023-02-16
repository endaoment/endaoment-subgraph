require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.9',
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.RPC_URL,
        blockNumber: 16639611,
      },
      mining: {
        mempool: {
          order: 'fifo',
        },
      },
    },
  },
  paths: {
    cache: './.hh/cache',
    artifacts: './.hh/artifacts',
  },
}
