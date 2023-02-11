import { afterEach, beforeEach, describe, clearStore, test, assert } from 'matchstick-as'
import {
  createDefaultDonationEvent,
  createDefaultValueTransferredEvent,
  DEFAULT_ENTITY_ADDRESS,
  mockBalance,
} from './utils/ndao-entity'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { handleEntityDonationReceived, handleEntityValueTransferred } from '../src/mappings/ndao-entity'
import { NdaoEntity } from '../generated/schema'

const DEFAULT_FUND_ADDRESS = Address.fromString('0x9f2E8FAC6dec33233d8864b48319032a753151B7')
const DEFAULT_ORG_ADDRESS = DEFAULT_ENTITY_ADDRESS
const DEFAULT_ORG2_ADDRESS = Address.fromString('0x52CD08D2E2BBB0623515A0b61fB7890cf106b19E')

describe('NdaoEntity Tests', () => {
  beforeEach(() => {
    // Initialize entity via event handler
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

  test('it should correctly index donations', () => {
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
  })

  describe('Transfer Indexing', () => {
    beforeEach(() => {
      // Initialize entities via event handler
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

    test('it should correctly index grant transfers', () => {
      // ----- Arrange ------
      const transferEvent = createDefaultValueTransferredEvent(DEFAULT_FUND_ADDRESS, DEFAULT_ORG_ADDRESS, 200_000_000)
      const netTransferAmount = transferEvent.params.amountReceived.minus(transferEvent.params.amountFee)
      const fee = transferEvent.params.amountFee

      mockBalance(DEFAULT_FUND_ADDRESS, 0)
      mockBalance(DEFAULT_ORG_ADDRESS, netTransferAmount.toI32())

      // ------ Act -------
      handleEntityValueTransferred(transferEvent)

      // ------ Assert ------
      const destinationOrg = NdaoEntity.load(DEFAULT_ORG_ADDRESS)
      const sourceFund = NdaoEntity.load(DEFAULT_FUND_ADDRESS)

      if (!destinationOrg || !sourceFund) throw new Error('Entity not found in store')

      // Assert destination changes
      assert.bigIntEquals(netTransferAmount, destinationOrg.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcDonationFees)
      assert.bigIntEquals(netTransferAmount, destinationOrg.totalUsdcGrantsReceived)
      assert.bigIntEquals(fee, destinationOrg.totalUsdcGrantInFees)
      assert.bigIntEquals(netTransferAmount, destinationOrg.totalUsdcContributionsReceived)
      assert.bigIntEquals(fee, destinationOrg.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcMigrated)
      assert.bigIntEquals(netTransferAmount, destinationOrg.totalUsdcReceived)
      assert.bigIntEquals(fee, destinationOrg.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcPaidOutFees)

      // Assert source changes
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcReceivedFees)
      assert.bigIntEquals(netTransferAmount, sourceFund.totalUsdcGrantedOut)
      assert.bigIntEquals(fee, sourceFund.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.totalUsdcPaidOutFees)
    })

    test('it should correctly index normal transfers', () => {
      // ----- Arrange ------
      const transferEvent = createDefaultValueTransferredEvent(DEFAULT_ORG2_ADDRESS, DEFAULT_ORG_ADDRESS, 200_000_000)
      const netTransferAmount = transferEvent.params.amountReceived.minus(transferEvent.params.amountFee)
      const fee = transferEvent.params.amountFee

      mockBalance(DEFAULT_ORG2_ADDRESS, 0)
      mockBalance(DEFAULT_ORG_ADDRESS, netTransferAmount.toI32())

      // ------ Act -------
      handleEntityValueTransferred(transferEvent)

      // ------ Assert ------
      const destinationOrg = NdaoEntity.load(DEFAULT_ORG_ADDRESS)
      const sourceOrg = NdaoEntity.load(DEFAULT_ORG2_ADDRESS)

      if (!destinationOrg || !sourceOrg) throw new Error('Entity not found in store')

      // Assert destination changes
      assert.bigIntEquals(netTransferAmount, destinationOrg.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcContributionFees)
      assert.bigIntEquals(netTransferAmount, destinationOrg.totalUsdcTransfersReceived)
      assert.bigIntEquals(fee, destinationOrg.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcMigrated)
      assert.bigIntEquals(netTransferAmount, destinationOrg.totalUsdcReceived)
      assert.bigIntEquals(fee, destinationOrg.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcPaidOutFees)

      // Assert source changes
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.investmentBalance)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcGrantedOutFees)
      assert.bigIntEquals(netTransferAmount, sourceOrg.totalUsdcTransferredOut)
      assert.bigIntEquals(fee, sourceOrg.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.totalUsdcPaidOutFees)
    })

    test('it should aggregate grant values with donation values', () => {
      // ----- Arrange ------
      const transferEvent = createDefaultValueTransferredEvent(DEFAULT_FUND_ADDRESS, DEFAULT_ORG_ADDRESS, 200_000_000)
      const netGrantAmount = transferEvent.params.amountReceived.minus(transferEvent.params.amountFee)
      const grantFee = transferEvent.params.amountFee

      const donationEvent = createDefaultDonationEvent(DEFAULT_ORG_ADDRESS, 100_000_000)
      const netDonationAmount = donationEvent.params.amountReceived.minus(donationEvent.params.amountFee)
      const donationFee = donationEvent.params.amountFee

      const totalNetContribution = netDonationAmount.plus(netGrantAmount)
      const totalContributionFee = donationFee.plus(grantFee)

      mockBalance(DEFAULT_FUND_ADDRESS, 0)
      mockBalance(DEFAULT_ORG_ADDRESS, totalNetContribution.toI32())

      // ------ Act -------
      handleEntityValueTransferred(transferEvent)
      handleEntityDonationReceived(donationEvent)

      // ------ Assert ------
      const destinationOrg = NdaoEntity.load(DEFAULT_ORG_ADDRESS)

      if (!destinationOrg) throw new Error('Entity not found in store')

      // Assert destination changes
      assert.bigIntEquals(totalNetContribution, destinationOrg.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.investmentBalance)
      assert.bigIntEquals(netDonationAmount, destinationOrg.totalUsdcDonationsReceived)
      assert.bigIntEquals(donationFee, destinationOrg.totalUsdcDonationFees)
      assert.bigIntEquals(netGrantAmount, destinationOrg.totalUsdcGrantsReceived)
      assert.bigIntEquals(grantFee, destinationOrg.totalUsdcGrantInFees)
      assert.bigIntEquals(totalNetContribution, destinationOrg.totalUsdcContributionsReceived)
      assert.bigIntEquals(totalContributionFee, destinationOrg.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcMigrated)
      assert.bigIntEquals(totalNetContribution, destinationOrg.totalUsdcReceived)
      assert.bigIntEquals(totalContributionFee, destinationOrg.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.totalUsdcPaidOutFees)
    })

    test('it should refresh source entity and destination entity balance', () => {
      // ----- Arrange ------
      const transferEvent = createDefaultValueTransferredEvent(DEFAULT_FUND_ADDRESS, DEFAULT_ORG_ADDRESS, 200_000_000)
      const netGrantAmount = transferEvent.params.amountReceived.minus(transferEvent.params.amountFee)
      const grantFee = transferEvent.params.amountFee

      mockBalance(DEFAULT_FUND_ADDRESS, 10)
      mockBalance(DEFAULT_ORG_ADDRESS, 20)

      // ------ Act -------
      handleEntityValueTransferred(transferEvent)

      // ------ Assert ------
      const destinationOrg = NdaoEntity.load(DEFAULT_ORG_ADDRESS)
      const sourceFund = NdaoEntity.load(DEFAULT_FUND_ADDRESS)

      if (!destinationOrg || !sourceFund) throw new Error('Entity not found in store')

      // Assert destination changes
      assert.bigIntEquals(BigInt.fromI32(20), destinationOrg.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromI32(10), sourceFund.recognizedUsdcBalance)
    })
  })
})
