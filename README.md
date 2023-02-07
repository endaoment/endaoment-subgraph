# endaoment-subgraph
Subgraph for the Endaoment Protocol

## Local Development
This section covers how to run the subgraph locally

### Requirements
[//]: # (TODO: Figure out if I can bundle the hardhat node here. That's probably the best move instead of making it running a requirement)

1. Docker is installed and running.
2. Docker has at least 20 GB of memory assigned to it.
3. Have a forked Ethereum node running on `0.0.0.0:8545`

### Steps
1. Run `yarn docker-up`
   - This will standup the indexing infrastructure and start indexing the latest blocks of your ethereum node.
2. Run `yarn create-local` to reserve the name for the subgraph on your local node.
3. Run `yarn deploy-local` to deploy the subgraph code. 
4. Once the latest block has been indexed, the URL made available on the deployment step will start serving up-to-date requests.

### TODOS
- [ ] Setup hardhat node here.
- [ ] Investigate how to build [M1 Image to not blow up memory](https://github.com/graphprotocol/graph-node/tree/master/docker#running-graph-node-on-an-macbook-m1)