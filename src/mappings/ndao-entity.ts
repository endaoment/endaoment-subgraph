import { EntityDonationReceived, EntityValueTransferred } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { reconcileV1Migration } from '../utils/v1-migration-reconciliation'
import { loadNdaoEntityOrThrow } from '../utils/ndao-entity-utils'
import { FUND_ENTITY_TYPE, ORG_ENTITY_TYPE } from '../utils/on-chain-entity-type'
import { NdaoEntity } from '../../generated/schema'

export function handleEntityDonationReceived(event: EntityDonationReceived): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)

  // Run v1 migration reconciliation logic
  const netUsdcDonated = event.params.amountReceived.minus(event.params.amountFee)
  reconcileV1Migration(entity, netUsdcDonated, event)

  // Update entity values
  const contract = NdaoEntityContract.bind(event.address)
  entity.recognizedUsdcBalance = contract.balance()

  entity.totalUsdcDonationsReceived = entity.totalUsdcDonationsReceived.plus(netUsdcDonated)
  entity.totalUsdcContributionsReceived = entity.totalUsdcContributionsReceived.plus(netUsdcDonated)
  entity.totalUsdcReceived = entity.totalUsdcReceived.plus(netUsdcDonated)

  entity.totalUsdcDonationFees = entity.totalUsdcDonationFees.plus(event.params.amountFee)
  entity.totalUsdcContributionFees = entity.totalUsdcContributionFees.plus(event.params.amountFee)
  entity.totalUsdcReceivedFees = entity.totalUsdcReceivedFees.plus(event.params.amountFee)

  entity.save()
}
function indexGrant(source: NdaoEntity, destination: NdaoEntity, event: EntityValueTransferred): void {
  // Update source entity values
  // source.totalUsdcGrantedOut = source.totalUsdcGrantedOut.plus(event.params.)
  // Update destination entity values
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
  target.recognizedUsdcBalance = sourceContract.balance()

  // Update values relevant to the type of transfer that was executed
  // log.info('Source type: {}, target type: {}', [source.entityType, target.entityType])
  const isGrantTransfer = source.entityType == FUND_ENTITY_TYPE && target.entityType == ORG_ENTITY_TYPE
  if (isGrantTransfer) {
    // log.info('Grant transfer detected', [])
    source.totalUsdcGrantedOut = source.totalUsdcGrantedOut.plus(netAmount)
    source.totalUsdcGrantedOutFees = source.totalUsdcGrantedOutFees.plus(fees)

    target.totalUsdcGrantsReceived = target.totalUsdcGrantsReceived.plus(netAmount)
    target.totalUsdcContributionsReceived = target.totalUsdcContributionsReceived.plus(netAmount)
    target.totalUsdcReceived = target.totalUsdcReceived.plus(netAmount)

    target.totalUsdcGrantInFees = target.totalUsdcGrantInFees.plus(fees)
    target.totalUsdcContributionFees = target.totalUsdcContributionFees.plus(fees)
    target.totalUsdcReceivedFees = target.totalUsdcReceivedFees.plus(fees)
  } else {
    // log.info('Normal transfer detected', [])
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
