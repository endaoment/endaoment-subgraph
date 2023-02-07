# endaoment-subgraph
Subgraph for the Endaoment Protocol

## Local Development
This section covers how to run the subgraph locally

### Requirements
1. Docker is installed and running.
2. Docker has at least 10 GB of memory assigned to it.
3. If you are running this repository on a Mac M1, [manually build the graph node docker image.](https://github.com/graphprotocol/graph-node/tree/master/docker#running-graph-node-on-an-macbook-m1)

### Steps
1. Create a `.env` file at the root of the project using the `.env.model` file as a reference and fill in the necessary values.
2. Spin up a forked hardhat node with `yarn hardhat`
3. Run `yarn docker-up`
   - This will standup the indexing infrastructure and start indexing the latest blocks of your ethereum node.
4. Run `yarn create-local` to reserve the name for the subgraph on your local node.
5. Run `yarn deploy-local` to deploy the subgraph code. 
6. Once the latest block has been indexed, the URL made available on the deployment step will start serving up-to-date requests.