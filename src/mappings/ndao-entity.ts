import {
  EntityBalanceCorrected,
  EntityBalanceReconciled,
  EntityDeposit,
  EntityDonationReceived,
  EntityEthReceived,
  EntityRedeem,
  EntityValuePaidOut,
  EntityValueTransferred,
} from '../../generated/templates/NdaoEntity/NdaoEntity'
import { Address, BigInt, ethereum, log, store } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { reconcileV1Migration } from '../utils/v1-migration-reconciliation'
import { loadNdaoEntityOrThrow } from '../utils/ndao-entity-utils'
import { FUND_ENTITY_TYPE, ORG_ENTITY_TYPE } from '../utils/on-chain-entity-type'
import { PortfolioPosition } from '../../generated/schema'

function registerDonation(event: ethereum.Event, usdcDonated: BigInt, fee: BigInt): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)

  // Run v1 migration reconciliation logic
  const netUsdcDonated = usdcDonated.minus(fee)
  reconcileV1Migration(entity, netUsdcDonated, event)

  // Update entity values
  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()

  entity.totalUsdcDonationsReceived = entity.totalUsdcDonationsReceived.plus(netUsdcDonated)
  entity.totalUsdcContributionsReceived = entity.totalUsdcContributionsReceived.plus(netUsdcDonated)
  entity.totalUsdcReceived = entity.totalUsdcReceived.plus(netUsdcDonated)

  entity.totalUsdcDonationFees = entity.totalUsdcDonationFees.plus(fee)
  entity.totalUsdcContributionFees = entity.totalUsdcContributionFees.plus(fee)
  entity.totalUsdcReceivedFees = entity.totalUsdcReceivedFees.plus(fee)

  entity.save()
}

export function handleEntityDonationReceived(event: EntityDonationReceived): void {
  registerDonation(event, event.params.amountReceived, event.params.amountFee)
}

export function handleEntityValueTransferred(event: EntityValueTransferred): void {
  // Fetch entity and ensure it exists
  const source = loadNdaoEntityOrThrow(event.address)
  const target = loadNdaoEntityOrThrow(event.params.to)

  // Run v1 migration reconciliation logic
  const negativeTransferAmount = event.params.amountReceived.times(BigInt.fromI32(-1))
  const fees = event.params.amountFee
  const netAmount = event.params.amountReceived.minus(event.params.amountFee)
  reconcileV1Migration(source, negativeTransferAmount, event)
  reconcileV1Migration(target, netAmount, event)

  // Refresh balances of both entities involved in the transfer
  const sourceContract = NdaoEntityContract.bind(Address.fromBytes(source.id))
  source.recognizedUsdcBalance = sourceContract.balance()

  const targetContract = NdaoEntityContract.bind(Address.fromBytes(target.id))
  target.recognizedUsdcBalance = targetContract.balance()

  // Update values relevant to the type of transfer that was executed
  const isGrantTransfer = source.entityType == FUND_ENTITY_TYPE && target.entityType == ORG_ENTITY_TYPE
  if (isGrantTransfer) {
    source.totalUsdcGrantedOut = source.totalUsdcGrantedOut.plus(netAmount)
    source.totalUsdcGrantedOutFees = source.totalUsdcGrantedOutFees.plus(fees)

    target.totalUsdcGrantsReceived = target.totalUsdcGrantsReceived.plus(netAmount)
    target.totalUsdcContributionsReceived = target.totalUsdcContributionsReceived.plus(netAmount)
    target.totalUsdcReceived = target.totalUsdcReceived.plus(netAmount)

    target.totalUsdcGrantInFees = target.totalUsdcGrantInFees.plus(fees)
    target.totalUsdcContributionFees = target.totalUsdcContributionFees.plus(fees)
    target.totalUsdcReceivedFees = target.totalUsdcReceivedFees.plus(fees)
  } else {
    source.totalUsdcTransferredOut = source.totalUsdcTransferredOut.plus(netAmount)
    source.totalUsdcTransferredOutFees = source.totalUsdcTransferredOutFees.plus(fees)

    target.totalUsdcTransfersReceived = target.totalUsdcTransfersReceived.plus(netAmount)
    target.totalUsdcReceived = target.totalUsdcReceived.plus(netAmount)

    target.totalUsdcTransferInFees = target.totalUsdcTransferInFees.plus(fees)
    target.totalUsdcReceivedFees = target.totalUsdcReceivedFees.plus(fees)
  }

  source.save()
  target.save()
}

export function handleEntityBalanceReconciled(event: EntityBalanceReconciled): void {
  registerDonation(event, event.params.amountReceived, event.params.amountFee)
}

export function handleEntityBalanceCorrected(event: EntityBalanceCorrected): void {
  // This event is only emitted in the edge case where balance is subtracted from the entity using
  // Entity:callAsEntity. On those cases, because the graph has no awareness of how the balance was reduced,
  // it cannot categorize the cash outflow and will only update the recognized balance.
  const entity = loadNdaoEntityOrThrow(event.address)

  // Run v1 migration reconciliation logic, but without recognizing any cashflow (since we don't know how much
  // was removed)
  reconcileV1Migration(entity, BigInt.zero(), event)

  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()

  // Save the entity
  entity.save()
}

export function handleEntityValuePaidOut(event: EntityValuePaidOut): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)

  // Run v1 migration reconciliation logic
  const negativeValuePaidOut = event.params.amountSent.times(BigInt.fromI32(-1))
  reconcileV1Migration(entity, negativeValuePaidOut, event)

  // Update entity values
  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()

  const netValuePaidOut = event.params.amountSent.minus(event.params.amountFee)
  entity.totalUsdcPaidOut = entity.totalUsdcPaidOut.plus(netValuePaidOut)
  entity.totalUsdcPaidOutFees = entity.totalUsdcPaidOutFees.plus(event.params.amountFee)

  entity.save()
}

export function handleEntityDeposit(event: EntityDeposit): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)

  // Fetch position or create it if it doesn't exist
  const positionId = `${event.params.portfolio.toHex()}|${event.address.toHex()}`
  let position = PortfolioPosition.load(positionId)
  if (position == null) {
    position = new PortfolioPosition(positionId)
    position.entity = entity.id
    position.portfolio = event.params.portfolio
    position.shares = BigInt.zero()
    position.investedUsdc = BigInt.zero()
  }

  // Run v1 migration reconciliation logic
  const negativeDepositAmount = event.params.baseTokenDeposited.times(BigInt.fromI32(-1))
  reconcileV1Migration(entity, negativeDepositAmount, event)

  // Update entity values
  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()
  entity.investedUsdc = entity.investedUsdc.plus(event.params.baseTokenDeposited)

  // Update portfolio position values
  position.shares = position.shares.plus(event.params.sharesReceived)
  position.investedUsdc = position.investedUsdc.plus(event.params.baseTokenDeposited)

  entity.save()
  position.save()
}

export function handleEntityRedeem(event: EntityRedeem): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)

  // Fetch position
  const positionId = `${event.params.portfolio.toHex()}|${event.address.toHex()}`
  let position = PortfolioPosition.load(positionId)

  // Unlikely the position would ever be null at this point since Endaoment does not support short-selling Portfolio
  // shares, but if one day we do, we don't want to hang the subgraph and prefer ignoring this unsupported event.
  if (position == null) {
    return
  }

  // Run v1 migration reconciliation logic
  reconcileV1Migration(entity, event.params.baseTokenReceived, event)

  // Calculate proportional invested USDC amount to redeem
  const proportionalRedemption = event.params.sharesRedeemed.times(position.investedUsdc).div(position.shares)

  // Update entity values
  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()
  entity.investedUsdc = entity.investedUsdc.minus(proportionalRedemption)

  // Update portfolio position values
  position.shares = position.shares.minus(event.params.sharesRedeemed)
  position.investedUsdc = position.investedUsdc.minus(proportionalRedemption)

  // Save entity
  entity.save()

  // If position is empty, remove it from the database to prevent polluting the Positions array of a given entity.
  // Save otherwise.
  if (position.shares.equals(BigInt.zero()) && position.investedUsdc.equals(BigInt.zero())) {
    store.remove('PortfolioPosition', positionId)
  } else {
    position.save()
  }
}

export function handleEntityEthReceived(event: EntityEthReceived): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)

  // Run v1 migration reconciliation logic
  reconcileV1Migration(entity, BigInt.zero(), event)

  // Update entity values. Ideally, we would like to query the outstanding ETH balance of the entity, but that is not
  // currently supported by The Graph. See this discord message for more details:
  // https://discord.com/channels/438038660412342282/438070183794573313/1065286527858516018
  entity.totalEthReceived = entity.totalEthReceived.plus(event.params.amount)
  entity.save()
}
