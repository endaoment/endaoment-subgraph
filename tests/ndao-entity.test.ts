import { afterEach, beforeEach, describe, clearStore, test, assert } from 'matchstick-as'
import {
  createDefaultValuePaidOutEvent,
  createDefaultBalanceReconciledEvent,
  createDefaultDonationEvent,
  createDefaultValueTransferredEvent,
  createEntityBalanceCorrectedEvent,
  DEFAULT_ENTITY_ADDRESS,
  DEFAULT_FUND_ADDRESS,
  DEFAULT_ORG2_ADDRESS,
  DEFAULT_ORG_ADDRESS,
  EXTERNAL_ADDRESS,
  mockBalance,
  mockOrgId,
  createEntityDepositEvent,
  PORTFOLIO_1_ADDRESS,
  PORTFOLIO_2_ADDRESS,
  createEntityRedeemEvent,
} from './utils/ndao-entity'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import {
  handleEntityBalanceCorrected,
  handleEntityBalanceReconciled,
  handleEntityDeposit,
  handleEntityDonationReceived,
  handleEntityRedeem,
  handleEntityValuePaidOut,
  handleEntityValueTransferred,
} from '../src/mappings/ndao-entity'
import { NdaoEntity, PortfolioPosition } from '../generated/schema'

describe('NdaoEntity Tests', () => {
  beforeEach(() => {
    // Initialize entity via event handler
    mockOrgId(DEFAULT_ORG_ADDRESS, '844661797')
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
    assert.bigIntEquals(BigInt.fromI32(0), entity.investedUsdc)
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
      mockOrgId(DEFAULT_ORG2_ADDRESS, '814661797')
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
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.investedUsdc)
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
      assert.bigIntEquals(BigInt.fromI32(0), sourceFund.investedUsdc)
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
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.investedUsdc)
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
      assert.bigIntEquals(BigInt.fromI32(0), sourceOrg.investedUsdc)
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
      assert.bigIntEquals(BigInt.fromI32(0), destinationOrg.investedUsdc)
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

  test('it should correctly index balance reconciled', () => {
    // ------ Act -------
    // Block 1:
    // - 1 Reconciliation of 400 USD.
    // - Fees = 2 USD (0.5%)
    // - Balance at the end of block: 398 USD
    mockBalance(DEFAULT_ENTITY_ADDRESS, 398_000_000)
    handleEntityBalanceReconciled(createDefaultBalanceReconciledEvent(DEFAULT_ENTITY_ADDRESS, 400_000_000))

    // Block 2:
    // - 1 donation of 150 USD.
    // - Fees = 0.75 USD (0.5%)
    // - Balance at the end of block: 547.25 USD
    mockBalance(DEFAULT_ENTITY_ADDRESS, 547_250_000)
    handleEntityDonationReceived(createDefaultDonationEvent(DEFAULT_ENTITY_ADDRESS, 150_000_000, 2))

    // ------ Assert ------
    const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(547_250_000), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investedUsdc)
    assert.bigIntEquals(BigInt.fromI32(547_250_000), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(2_750_000), entity.totalUsdcDonationFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
    assert.bigIntEquals(BigInt.fromI32(547_250_000), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(2_750_000), entity.totalUsdcContributionFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(547_250_000), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(2_750_000), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
  })

  test('it should correctly index balance corrected', () => {
    // ------ Arrange -------
    const balance = 398_000_000

    // ------ Act -------
    mockBalance(DEFAULT_ENTITY_ADDRESS, balance)
    handleEntityBalanceCorrected(createEntityBalanceCorrectedEvent(DEFAULT_ENTITY_ADDRESS, balance))

    // ------ Assert ------
    const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(balance), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investedUsdc)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
  })

  test('it should correctly index value paid out', () => {
    // ------ Arrange -------
    const finalBalance = 200_000_000

    // ------ Act -------
    mockBalance(DEFAULT_ENTITY_ADDRESS, finalBalance)

    // Net Payout = 199 USD | Fee = 1 USD
    handleEntityValuePaidOut(createDefaultValuePaidOutEvent(DEFAULT_ENTITY_ADDRESS, EXTERNAL_ADDRESS, 200_000_000))

    // ------ Assert ------
    const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
    if (!entity) throw new Error('Entity not found in store')

    assert.bigIntEquals(BigInt.fromI32(finalBalance), entity.recognizedUsdcBalance)
    assert.bigIntEquals(BigInt.fromI32(0), entity.investedUsdc)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
    assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
    assert.bigIntEquals(BigInt.fromI32(199_000_000), entity.totalUsdcPaidOut)
    assert.bigIntEquals(BigInt.fromI32(1_000_000), entity.totalUsdcPaidOutFees)
  })

  describe('Portfolios', () => {
    test('it should correctly index a single portfolio deposit', () => {
      // ------ Arrange -------
      const investedAmount: u64 = 400_000_000
      const shares: u64 = investedAmount * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 0)
      handleEntityDeposit(createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount, shares))

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(0), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(investedAmount), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position.entity)
      assert.bytesEquals(PORTFOLIO_1_ADDRESS, position.portfolio)
      assert.bigIntEquals(BigInt.fromU64(shares), position.shares)
      assert.bigIntEquals(BigInt.fromU64(investedAmount), position.investedUsdc)
    })

    test('it should correctly index portfolio deposits to different portfolios', () => {
      // ------ Arrange -------
      const investedAmount1: u64 = 400_000_000
      const shares1: u64 = investedAmount1 * 10
      const investedAmount2: u64 = 200_000_000
      const shares2: u64 = investedAmount2 * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 0)
      handleEntityDeposit(
        createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount1, shares1),
      )
      handleEntityDeposit(
        createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_2_ADDRESS, investedAmount2, shares2),
      )

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(0), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(investedAmount1 + investedAmount2), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position1 = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position1) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position1.entity)
      assert.bytesEquals(PORTFOLIO_1_ADDRESS, position1.portfolio)
      assert.bigIntEquals(BigInt.fromU64(shares1), position1.shares)
      assert.bigIntEquals(BigInt.fromU64(investedAmount1), position1.investedUsdc)

      const position2 = PortfolioPosition.load(`${PORTFOLIO_2_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position2) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position2.entity)
      assert.bytesEquals(PORTFOLIO_2_ADDRESS, position2.portfolio)
      assert.bigIntEquals(BigInt.fromU64(shares2), position2.shares)
      assert.bigIntEquals(BigInt.fromU64(investedAmount2), position2.investedUsdc)
    })

    test('it should correctly index multiple portfolio deposits to the same portfolio', () => {
      // ------ Arrange -------
      const investedAmount1: u64 = 400_000_000
      const shares1: u64 = investedAmount1 * 10
      const investedAmount2: u64 = 200_000_000
      const shares2: u64 = investedAmount2 * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 0)
      handleEntityDeposit(
        createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount1, shares1),
      )
      handleEntityDeposit(
        createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount2, shares2),
      )

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(0), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(investedAmount1 + investedAmount2), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position1 = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position1) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position1.entity)
      assert.bytesEquals(PORTFOLIO_1_ADDRESS, position1.portfolio)
      assert.bigIntEquals(BigInt.fromU64(shares1 + shares2), position1.shares)
      assert.bigIntEquals(BigInt.fromU64(investedAmount1 + investedAmount2), position1.investedUsdc)
    })

    test('it should correctly index a full redemption', () => {
      // ------ Arrange -------
      const investedAmount: u64 = 400_000_000
      const shares: u64 = investedAmount * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 400_000_000)
      handleEntityDeposit(createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount, shares))
      handleEntityRedeem(createEntityRedeemEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, shares, investedAmount))

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(400_000_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(0), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (position) throw new Error('Expected portfolio position to be null')
    })

    test('it should correctly index a partial redemption (50%)', () => {
      // ------ Arrange -------
      const investedAmount: u64 = 400_000_000
      const shares: u64 = investedAmount * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 400_000_000)
      handleEntityDeposit(createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount, shares))
      handleEntityRedeem(
        createEntityRedeemEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, shares / 2, investedAmount),
      )

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(400_000_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(200_000_000), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position.entity)
      assert.bytesEquals(PORTFOLIO_1_ADDRESS, position.portfolio)
      assert.bigIntEquals(BigInt.fromU64(shares / 2), position.shares)
      assert.bigIntEquals(BigInt.fromU64(investedAmount / 2), position.investedUsdc)
    })

    test('it should correctly index a partial redemption (25%)', () => {
      // ------ Arrange -------
      const investedAmount: u64 = 400_000_000
      const shares: u64 = investedAmount * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 400_000_000)
      handleEntityDeposit(createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount, shares))
      handleEntityRedeem(
        createEntityRedeemEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, shares / 4, investedAmount),
      )

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(400_000_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(300_000_000), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position.entity)
      assert.bytesEquals(PORTFOLIO_1_ADDRESS, position.portfolio)
      assert.bigIntEquals(BigInt.fromU64((shares * 3) / 4), position.shares)
      assert.bigIntEquals(BigInt.fromU64((investedAmount * 3) / 4), position.investedUsdc)
    })

    test('it should correctly index a partial redemption (10%)', () => {
      // ------ Arrange -------
      const investedAmount: u64 = 400_000_000
      const shares: u64 = investedAmount * 10

      // ------ Act -------
      mockBalance(DEFAULT_ENTITY_ADDRESS, 400_000_000)
      handleEntityDeposit(createEntityDepositEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, investedAmount, shares))
      handleEntityRedeem(
        createEntityRedeemEvent(DEFAULT_ENTITY_ADDRESS, PORTFOLIO_1_ADDRESS, shares / 10, investedAmount),
      )

      // ------ Assert ------
      const entity = NdaoEntity.load(DEFAULT_ENTITY_ADDRESS)
      if (!entity) throw new Error('Entity not found in store')

      assert.bigIntEquals(BigInt.fromI32(400_000_000), entity.recognizedUsdcBalance)
      assert.bigIntEquals(BigInt.fromU64(360_000_000), entity.investedUsdc)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
      assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)

      const position = PortfolioPosition.load(`${PORTFOLIO_1_ADDRESS.toHex()}|${DEFAULT_ENTITY_ADDRESS.toHex()}`)
      if (!position) throw new Error('Portfolio position not found in store')

      assert.bytesEquals(entity.id, position.entity)
      assert.bytesEquals(PORTFOLIO_1_ADDRESS, position.portfolio)
      assert.bigIntEquals(BigInt.fromU64((shares * 9) / 10), position.shares)
      assert.bigIntEquals(BigInt.fromU64((investedAmount * 9) / 10), position.investedUsdc)
    })
  })
})
