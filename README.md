<a href="https://developers.endaoment.org/" target="_blank" rel="noopener">
  <img alt="Endaoment developers" src="https://storage.googleapis.com/endaoment-static/readme-assets/graph-readme-cover.png" />
</a>

<div align="center">
  <h1>Endaoment Subgraph</h1>
        <a href="https://docs.endaoment.org/developers">
        <img src="https://img.shields.io/static/v1?label=&message=Documentation&colorA=E4EBF4&colorB=E4EBF4&style=flat&logo=gitbook" alt="Gitbook">
        </a>
    <a href="https://twitter.com/endaomentdotorg">
    <img src="https://img.shields.io/twitter/url.svg?label=%40endaomentdotorg&style=social&url=https%3A%2F%2Ftwitter.com%2Fendaomentdotorg" alt="@endaomentdotorg">
      <a href="https://discord.gg/endaoment">
        <img alt="Discord" src="https://img.shields.io/discord/734855436276334746?color=7389D8&label&logo=discord&logoColor=ffffff" />
        </a>
        <a href="https://etherscan.io/address/0xbe21e4cf884c8b2517e4e199487f8b505841cb36">
        <img src="https://img.shields.io/static/v1?label=ENS&message=endaoment.eth&colorA=696F8C&colorB=696F8C&style=flat&logo=ethereum" alt="endaoment.eth">
        </a>
  </a>
  <br/><br/>
</div>

Subgraph for the Endaoment Protocol

## Getting started
1. Install dependencies with `yarn install`
2. Run tests with `yarn test`

## Local Development
This section covers how to spin up a local indexer node with the Endaoment subgraph.

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

### Redeploying after changes
If you made changes to the subgrah and wish to see it reflected in the local node, run:

```shell
yarn redeploy-local
```
