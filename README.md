# endaoment-subgraph
Subgraph for the Endaoment Protocol

## Local Development
This section covers how to run the subgraph locally

### Requirements
[//]: # (TODO: Figure out if I can bundle the hardhat node here. That's probably the best move instead of making it running a requirement)

1. Docker is installed and running
2. Have an Ethereum node running on `0.0.0.0:8545`

### Steps
1. Run `yarn docker-up`
   - This will standup the indexing infrastructure and start indexing all blocks of the Ethereum node.
   - If your node is a fork from mainnet, **indexing will start at the genesis block**. Such nodes are not recommended for local development.
2. Run `yarn create-local` to reserve the name for the subgraph
3. Run `yarn deploy-local` to deploy the subgraph code. 
4. Once all blocks up to the latest have been indexed, the URL made available on the deployment step will start serving requests.