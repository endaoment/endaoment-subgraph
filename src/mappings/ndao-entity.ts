import { EntityDonationReceived } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { log } from '@graphprotocol/graph-ts'
import { NdaoEntity } from '../../generated/schema'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { reconcileV1Migration } from '../utils/v1-migration-reconciliation'

export function handleEntityDonationReceived(event: EntityDonationReceived): void {
  // Fetch entity and ensure it exists
  let entity = NdaoEntity.load(event.address)
  if (entity == null) {
    log.error(
      'Entity not found for donation event: {}. If you see this error, it is an indexing bug, since entities must ' +
        'exist in the database for donation events to start being indexed.',
      [event.address.toHexString()],
    )
    throw new Error('Indexing Error: Entity not found for donation event')
  }

  const netUsdcDonated = event.params.amountReceived.minus(event.params.amountFee)

  reconcileV1Migration(entity, netUsdcDonated, event)

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
