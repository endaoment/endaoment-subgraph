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

## Example Usage

This section covers a few examples of  queries that can be run against the Endaoment subgraph.

### Return Organization Data Based on EIN

```graphql
{
  ndaoEntities(where: { ein: "844661797"}) {
   contractAddress:id
    ein
    totalEthReceived
    entityManager
    recognizedUsdcBalance
    totalUsdcDonationsReceived
    totalUsdcDonationFees
    totalUsdcGrantsReceived
  }
}
```

returns

```json
{
  "data": {
    "ndaoEntities": [
      {
        "contractAddress": "0x7ecc1d4936a973ec3b153c0c713e0f71c59abf53",
        "ein": "844661797",
        "totalEthReceived": "1000000000000000",
        "entityManager": "0x0000000000000000000000000000000000000000",
        "recognizedUsdcBalance": "15462642",
        "totalUsdcDonationsReceived": "15462642",
        "totalUsdcDonationFees": "235471",
        "totalUsdcGrantsReceived": "205499497500"
      }
    ]
  }
}
```

### Return Largest Endaoment Grantors

```graphql
query biggestGrantors {
  ndaoEntities (
    orderBy: totalUsdcGrantedOut, orderDirection: desc, first: 5
  ) {
    contractAddress:id
    entityManager
    totalUsdcReceived
    totalUsdcGrantedOut
    totalUsdcGrantedOutFees
  }
}
```

returns

```json
{
  "data": {
    "ndaoEntities": [
      {
        "contractAddress": "0x244064a29c0a18dfbc387a9aebc76d425a59aa07",
        "entityManager": "0x5755f00aa02a07ac8a0727ac09042e6750759e1a",
        "totalUsdcReceived": "5851629709493",
        "totalUsdcGrantedOut": "1000098990000",
        "totalUsdcGrantedOutFees": "10102010000"
      },
      {
        "contractAddress": "0x14dc37374aff6e1748451a5ab7f01d865b98214a",
        "entityManager": "0x3e5f2a9c096499c1e90eef78790ad604a8619d88",
        "totalUsdcReceived": "4520128047641",
        "totalUsdcGrantedOut": "260003700000",
        "totalUsdcGrantedOutFees": "2626300000"
      },
      {
        "contractAddress": "0xe3377e1e45af99fef4c1c31aa242c09710415634",
        "entityManager": "0x9f4633b29e89e10c869c8ce2197c63df06eb5355",
        "totalUsdcReceived": "209032316433",
        "totalUsdcGrantedOut": "206941986900",
        "totalUsdcGrantedOutFees": "2090323100"
      },
      {
        "contractAddress": "0x8fa2d80045c00cff6d83189c978c879da80e4e06",
        "entityManager": "0x2c4b47668ea298ef4ef98956774ea590e130cefa",
        "totalUsdcReceived": "2034484308842",
        "totalUsdcGrantedOut": "198000000000",
        "totalUsdcGrantedOutFees": "2000000000"
      },
      {
        "contractAddress": "0xa78bfb0e4c75deda7514aff31808b34b0f355654",
        "entityManager": "0x1b97ebfa8f9600840e08861459f6ccd25a95b8f5",
        "totalUsdcReceived": "370640375734",
        "totalUsdcGrantedOut": "99000000000",
        "totalUsdcGrantedOutFees": "1000000000"
      }
    ]
  }
```

### Return Summary of Endaoment Registry

```graphql
query registrySummary {
  registries {
    entityFactories
    swapWrappers
    portfolios
    address
    owner
  }
}
```

returns

```json
{
  "data": {
    "registries": [
      {
        "entityFactories": [
          "0x10fd9348136dcea154f752fe0b6db45fc298a589"
        ],
        "swapWrappers": [
          "0xdf01af7e93453c081408921742043df8c8f8c039"
        ],
        "portfolios": [
          "0x7d7013c1e786c787a9aa6bdb8e9885dd4ee94bb8",
          "0x1496c8eb81b8b7bbb15507837418135070bd95d0",
          "0x9c73f76d6f4aee8ea62f77442b8c27702e5d25d0"
        ],
        "address": "0x94106ca9c7e567109a1d39413052887d1f412183",
        "owner": "0xd7d78cf2f7c5a1b2e44080814d2f54a41a151a37"
      }
    ]
  }
  
