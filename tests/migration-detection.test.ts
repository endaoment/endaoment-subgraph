import { afterEach, beforeEach, describe, clearStore, test, assert } from 'matchstick-as'
import {
  createDefaultDonationEvent,
  createDefaultValueTransferredEvent,
  createEntityDonationReceivedEvent,
  DEFAULT_ENTITY_ADDRESS,
  DEFAULT_FUND_ADDRESS,
  DEFAULT_ORG2_ADDRESS,
  DEFAULT_ORG_ADDRESS,
  mockBalance,
  mockOrgId,
} from './utils/ndao-entity'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { handleEntityDonationReceived, handleEntityValueTransferred } from '../src/mappings/ndao-entity'
import { NdaoEntity } from '../generated/schema'

describe('Migration Detection Tests', () => {
  beforeEach(() => {
    // Initialize entity via event handler
    mockOrgId(DEFAULT_ORG_ADDRESS, '814661797')
    const newEntityDeployedEvent = createEntityDeployedEvent(
      DEFAULT_ORG_ADDRESS,
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
    mockBalance(DEFAULT_ORG_ADDRESS, 199_000_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 100_000_000))
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 100_000_000))

    // Block 2:
    // - 1 donation of 150 USD.
    // - Fees = 0.75 USD (0.5%)
    // - Balance at the end of block: 348.25 USD
    mockBalance(DEFAULT_ORG_ADDRESS, 348_250_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))

    // ------ Assert ------
    const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcDonationFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcContributionFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
    assert.booleanEquals(true, entity.initialized)
  })

  test('it should correctly index multiple donations to an entity with V1 Assets', () => {
    // ------ Act -------
    // Block 1:
    // - 2 donations - 1 for 100 USD, another for 200 USD. Total 300 USD.
    // - Fees = 1.5 USD (0.5%)
    // - V1 Migrated Assets = 1000 USD
    // - Balance at the end of block: 1298,50 USD
    mockBalance(DEFAULT_ORG_ADDRESS, 1_298_500_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 100_000_000))
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 200_000_000))

    // Block 2:
    // - 1 donation of 150 USD.
    // - Fees = 0.75 USD (0.5%)
    // - Balance at the end of block: 1447.75 USD
    mockBalance(DEFAULT_ORG_ADDRESS, 1_447_750_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))
    const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

    // ------ Assert ------
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(1_447_750_000), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
    assert.bigIntEquals(BigInt.fromI32(447_750_000), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(2_250_000), entity.totalUsdcDonationFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
    assert.bigIntEquals(BigInt.fromI32(447_750_000), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(2_250_000), entity.totalUsdcContributionFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
    assert.bigIntEquals(BigInt.fromI32(1000_000_000), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(1_447_750_000), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(2_250_000), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
    assert.booleanEquals(true, entity.initialized)
  })

  test('it should correctly index single block donation to an entity with V1 Assets', () => {
    // ------ Act -------
    // Block 1:
    // - 1 donations of 200 USD
    // - Fees = 1.0 USD (0.5%)
    // - V1 Migrated Assets = 1200 USD
    // - Balance at the end of block: 1399,00 USD
    mockBalance(DEFAULT_ORG_ADDRESS, 1_399_000_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 200_000_000))

    // Block 2:
    // - 1 donation of 150 USD.
    // - Fees = 0.75 USD (0.5%)
    // - Balance at the end of block: 1548.25 USD
    mockBalance(DEFAULT_ORG_ADDRESS, 1_548_250_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))
    const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

    // ------ Assert ------
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(1_548_250_000), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcDonationFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
    assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcContributionFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
    assert.bigIntEquals(BigInt.fromI32(1200_000_000), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(1_548_250_000), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
    assert.booleanEquals(true, entity.initialized)
  })

  // TODO: Add test for events going back in time

  describe('Transfer events', () => {
    beforeEach(() => {
      // Initialize entities via event handler
      mockOrgId(DEFAULT_ORG2_ADDRESS, '834661797')
      const orgDeployed = createEntityDeployedEvent(
        DEFAULT_ORG2_ADDRESS,
        OnChainNdaoEntityType.Org,
        Address.fromString('0x0000000000000000000000000000000000000003'),
      )
      handleEntityDeployed(orgDeployed)

      const fundDeployed = createEntityDeployedEvent(
        DEFAULT_FUND_ADDRESS,
        OnChainNdaoEntityType.Fund,
        Address.fromString('0x0000000000000000000000000000000000000003'),
      )
      handleEntityDeployed(fundDeployed)
    })

    test('it should correctly index transfer event from an entity with V1 Assets (zero final balance)', () => {
      // ------ Act -------
      // Block 1:
      // - 2 transfers - 1 for 200 USD, another for 200 USD. Total 400 USD.
      // - Fees = 2 USD (0.5%)
      // - V1 Migrated Assets = 400 USD
      // - Balance at the end of block: 0 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 0)
      mockBalance(DEFAULT_ORG2_ADDRESS, 0) // here to not break the indexing logic for org2
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 200_000_000),
      )
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 200_000_000),
      )

      // Block 2:
      // - 1 Donation of 150 USD.
      // - Fees = 0.75 USD (0.5%)
      // - Balance at the end of block: 149.25 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 149_250_000)
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))
      const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

      // ------ Assert ------
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(149_250_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(149_250_000), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(750_000), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(149_250_000), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(750_000), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(400_000_000), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(149_250_000 + 400_000_000), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(750_000), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(398_000_000), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(2_000_000), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
      assert.booleanEquals(true, entity.initialized)
    })

    test('it should correctly index transfer event from an entity with V1 Assets (non-zero final balance)', () => {
      // ------ Act -------
      // Block 1:
      // - 2 transfers - 1 for 100 USD, another for 200 USD. Total 300 USD.
      // - Fees = 1.5 USD (0.5%)
      // - V1 Migrated Assets = 1100 USD
      // - Balance at the end of block: 800,00 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 800_000_000)
      mockBalance(DEFAULT_ORG2_ADDRESS, 0) // here to not break the indexing logic for org2
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 100_000_000),
      )
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 200_000_000),
      )

      // Block 2:
      // - 1 transfer of 150 USD.
      // - Fees = 0.75 USD (0.5%)
      // - Balance at the end of block: 650.00 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 650_000_000)
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 150_000_000, 2),
      )
      const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

      // ------ Assert ------
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(650_000_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(1100_000_000), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(1100_000_000), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(447_750_000), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(2_250_000), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
      assert.booleanEquals(true, entity.initialized)
    })

    test('it should correctly index transfer event from an entity without V1 Assets', () => {
      // ------ Act -------
      // Block 1:
      // - 1 Donation of 100 USD | 0.5 USD fee | Balance = 99.50 USD
      // - 1 Transfer out of 99.50 USD | 0.4975 USD fee | Balance = 0 USD
      // - No migrated assets
      // - Balance at the end of block: 0 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 0)
      mockBalance(DEFAULT_ORG2_ADDRESS, 0) // here to not break the indexing logic for org2
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 100_000_000))
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 99_500_000),
      )

      // Block 2:
      // - 1 donation of 150 USD | 0.75 USD fee | Balance = 149.25 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 149_250_000)
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))
      const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

      // ------ Assert ------
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(149_250_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(248_750_000), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(1_250_000), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(248_750_000), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(1_250_000), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(248_750_000), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(1_250_000), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(99_002_500), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(497_500), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
      assert.booleanEquals(true, entity.initialized)
    })

    test('it should correctly index transfer + donation events from an entity with V1 Assets (donation > transferOut)', () => {
      // ------ Act -------
      // Block 1:
      // - V1 Assets: 200 USD
      // - 1 Donation of 200 USD | 1 USD fee | Balance = 399 USD
      // - 1 Transfer out of 100 USD | 0.5 USD fee | Balance = 299 USD
      // - Balance at the end of block: 299 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 299_000_000)
      mockBalance(DEFAULT_ORG2_ADDRESS, 0) // here to not break the indexing logic for org2
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 200_000_000))
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 100_000_000),
      )

      // Block 2:
      // - 1 donation of 150 USD | 0.75 USD fee | Balance = 448.25 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 448_250_000)
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))
      const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

      // ------ Assert ------
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(448_250_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(348_250_000), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(200_000_000), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(548_250_000), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(1_750_000), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(99_500_000), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(500_000), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
      assert.booleanEquals(true, entity.initialized)
    })

    // 5. Delta negative (donation < transferOut)
    test('it should correctly index transfer + donation events from an entity with V1 Assets (donation < transferOut)', () => {
      // ------ Act -------
      // Block 1:
      // - V1 Assets: 200 USD
      // - 1 Donation of 100 USD | 0.5 USD fee | Balance = 299.5 USD
      // - 1 Transfer out of 200 USD | 0.5 USD fee | Balance = 99.5 USD
      // - Balance at the end of block: 99.5 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 99_500_000)
      mockBalance(DEFAULT_ORG2_ADDRESS, 0) // here to not break the indexing logic for org2
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 100_000_000))
      handleEntityValueTransferred(
        createDefaultValueTransferredEvent(DEFAULT_ORG_ADDRESS, DEFAULT_ORG2_ADDRESS, 200_000_000),
      )

      // Block 2:
      // - 1 donation of 150 USD | 0.75 USD fee | Balance = 248.75 USD
      mockBalance(DEFAULT_ORG_ADDRESS, 248_750_000)
      handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 150_000_000, 2))
      const entity = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

      // ------ Assert ------
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(248_750_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(248_750_000), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(1_250_000), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(248_750_000), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(1_250_000), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(200_000_000), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(448_750_000), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(1_250_000), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(199_000_000), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(1_000_000), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
      assert.booleanEquals(true, entity.initialized)
    })

    test('it should finalize migration on transfer destination (has v1 funds)', () => {
      // 1. Grant to Org
      // 2. Has migrated balance
    })

    test('it should finalize migration on transfer destination (no v1 funds)', () => {})
  })
})
