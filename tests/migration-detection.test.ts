import { afterEach, beforeEach, describe, clearStore, test, assert } from 'matchstick-as'
import {
  createDefaultDonationEvent,
  createEntityDonationReceivedEvent,
  DEFAULT_ENTITY_ADDRESS,
  mockBalance,
} from './utils/ndao-entity'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { handleEntityDonationReceived } from '../src/mappings/ndao-entity'
import { NdaoEntity } from '../generated/schema'

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
    // ------ Act -------
    // Block 1:
    // - 2 donations of 100 USD each. Total 200 USD.
    // - Fees = 1 USD (0.5%)
    // - No V1 Assets.
    // - Balance at the end of block: 199 USD
    mockBalance(DEFAULT_ENTITY_ADDRESS, 199_000_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 100_000_000))
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 100_000_000))

    // Block 2:
    // - 1 donation of 150 USD.
    // - Fees = 0.75 USD (0.5%)
    // - Balance at the end of block: 348.25 USD
    mockBalance(DEFAULT_ENTITY_ADDRESS, 348_250_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 150_000_000, 2))

    // ------ Assert ------
    const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcDonationsFee)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsInFee)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcContributionsFee)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersInFee)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
  })

  test('it should correctly index multiple donations to an entity with V1 Assets', () => {
    // ------ Act -------
    // Block 1:
    // - 2 donations - 1 for 100 USD, another for 200 USD. Total 300 USD.
    // - Fees = 1.5 USD (0.5%)
    // - V1 Migrated Assets = 1000 USD
    // - Balance at the end of block: 1298,50 USD
    mockBalance(DEFAULT_ENTITY_ADDRESS, 1_298_500_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 100_000_000))
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 200_000_000))
    const entityAtBlock1 = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)

    // Block 2:
    // - 1 donation of 150 USD.
    // - Fees = 0.75 USD (0.5%)
    // - Balance at the end of block: 1447.75 USD
    mockBalance(DEFAULT_ENTITY_ADDRESS, 1_447_750_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 150_000_000, 2))
    const entityAtBlock2 = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)

    // ------ Assert ------
    if (!entityAtBlock1 || !entityAtBlock2) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(1_447_750_000), entityAtBlock2.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.investmentBalance)
    assert.bigIntEquals(BigInt.fromI32(447_750_000), entityAtBlock2.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(2_250_000), entityAtBlock2.totalUsdcDonationsFee)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcGrantsInFee)
    assert.bigIntEquals(BigInt.fromI32(447_750_000), entityAtBlock2.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(2_250_000), entityAtBlock2.totalUsdcContributionsFee)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcTransfersInFee)
    assert.bigIntEquals(BigInt.fromI32(1000_000_000), entityAtBlock2.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(1_447_750_000), entityAtBlock2.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(2_250_000), entityAtBlock2.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entityAtBlock2.totalUsdcPaidOutFees)
  })
})
