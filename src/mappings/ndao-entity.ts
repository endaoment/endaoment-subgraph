import { EntityDonationReceived, EntityValueTransferred } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { log } from '@graphprotocol/graph-ts'
import { NdaoEntity } from '../../generated/schema'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { reconcileV1Migration } from '../utils/v1-migration-reconciliation'
import { loadNdaoEntityOrThrow } from '../utils/ndao-entity-utils'

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
  entity.totalUsdcDonationsFee = entity.totalUsdcDonationsFee.plus(event.params.amountFee)
  entity.totalUsdcContributionsReceived = entity.totalUsdcContributionsReceived.plus(netUsdcDonated)
  entity.totalUsdcContributionsFee = entity.totalUsdcContributionsFee.plus(event.params.amountFee)
  entity.totalUsdcReceived = entity.totalUsdcReceived.plus(netUsdcDonated)
  entity.totalUsdcReceivedFees = entity.totalUsdcReceivedFees.plus(event.params.amountFee)

  entity.save()
}

export function handleEntityValueTransferred(event: EntityValueTransferred): void {
  // Fetch entity and ensure it exists
  const entity = loadNdaoEntityOrThrow(event.address)
}
