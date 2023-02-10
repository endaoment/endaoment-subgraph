import { afterEach, beforeEach, describe, clearStore, test } from 'matchstick-as'
import {
  createDefaultDonationEvent,
  createEntityDonationReceivedEvent,
  DEFAULT_ENTITY_ADDRESS,
} from './ndao-entity-utils'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './org-fund-factory-utils'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { handleEntityDonationReceived } from '../src/mappings/ndao-entity'

// random ethereum address

describe('Migration Detection Tests', () => {
  beforeEach(() => {
    // Initialize entity via event handler
    const newEntityDeployedEvent = createEntityDeployedEvent(
      DEFAULT_ENTITY_ADDRESS,
      OnChainNdaoEntityType.Org,
      Address.fromString('0x0000000000000000000000000000000000000002'),
    )
    handleEntityDeployed(newEntityDeployedEvent)
  })

  afterEach(() => {
    clearStore()
  })

  test('it should correctly index multiple donations to an entity without V1 Assets', () => {
    // Arrange
    const events = [
      createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 100_000_000), // 100 USD - TOTAL 100 USD
      createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 100_000_000), // 100 USD - TOTAL 200 USD
      createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 150_000_000, 2), // 150 USD - TOTAL 350 USD - same block
    ]

    // Act
    events.forEach((event) => {
      handleEntityDonationReceived(event)
    })

    // Assert
  })
})
