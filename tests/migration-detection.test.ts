import { afterEach, beforeEach, describe, clearStore, test } from 'matchstick-as'
import { createEntityDonationReceivedEvent } from './ndao-entity-utils'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './org-fund-factory-utils'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { handleEntityDonationReceived } from '../src/mappings/ndao-entity'

// random ethereum address
const DONOR_ADDRESS = Address.fromString('0xe5Ce376f2904C780E6F006213719B38b73E286D7')
const ENTITY_ADDRESS = Address.fromString('0xDf6b465463eA501cAccBcdf895AaDEfc5726FbF0')
const TOKEN_IN = Address.fromString('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
const DEFAULT_IN = BigInt.fromI64(10 ** 18)

describe('Migration Detection Tests', () => {
  function createDonationEvent(to: Address, amountReceived: u64, blockNumber: i32 = 1): EntityDonationReceived {
    const amountInBi = BigInt.fromU64(amountReceived)
    const fee = amountInBi.times(BigInt.fromI32(5)).div(BigInt.fromI32(1000)) // 0.5% fee
    return createEntityDonationReceivedEvent(DONOR_ADDRESS, to, TOKEN_IN, DEFAULT_IN, amountInBi, fee, blockNumber)
  }

  beforeEach(() => {
    // Initialize entity via event handler
    log.warning('Initializing entity', [])
    const newEntityDeployedEvent = createEntityDeployedEvent(
      ENTITY_ADDRESS,
      OnChainNdaoEntityType.Org,
      Address.fromString('0x0000000000000000000000000000000000000002'),
    )
    handleEntityDeployed(newEntityDeployedEvent)
  })

  afterEach(() => {
    clearStore()
  })

  // 100 USD - TOTAL 100 USD
  // 100 USD - TOTAL 200 USD
  // 150 USD - TOTAL 350 USD (New block)
  test('it should correctly index multiple donations without V1 Assets', () => {
    // Arrange
    log.warning('Creating events', [])
    const events = [
      createDonationEvent(ENTITY_ADDRESS, 100_000_000), // 100 USD - TOTAL 100 USD
      createDonationEvent(ENTITY_ADDRESS, 100_000_000), // 100 USD - TOTAL 200 USD
      createDonationEvent(ENTITY_ADDRESS, 150_000_000, 2), // 150 USD - TOTAL 350 USD
    ]

    // Act
    log.warning('Handle donations', [])
    events.forEach((event) => {
      handleEntityDonationReceived(event)
    })

    // Assert
  })
})
