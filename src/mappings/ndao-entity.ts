import {
  EntityBalanceCorrected,
  EntityBalanceReconciled,
  EntityDeposit,
  EntityDonationReceived,
  EntityValuePaidOut,
  EntityValueTransferred,
} from '../../generated/templates/NdaoEntity/NdaoEntity'
import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { reconcileV1Migration } from '../utils/v1-migration-reconciliation'
import { loadNdaoEntityOrThrow } from '../utils/ndao-entity-utils'
import { FUND_ENTITY_TYPE, ORG_ENTITY_TYPE } from '../utils/on-chain-entity-type'

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

  // Run v1 migration reconciliation logic
  const negativeDepositAmount = event.params.baseTokenDeposited.times(BigInt.fromI32(-1))
  reconcileV1Migration(entity, negativeDepositAmount, event)

  // Update entity values
  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()

  // TODO: Implement updates here

  entity.save()
}
