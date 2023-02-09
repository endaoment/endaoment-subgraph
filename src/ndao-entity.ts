import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { BigInt, log } from '@graphprotocol/graph-ts'
import { NdaoEntity } from '../generated/schema'

export function handleEntityDonationReceived(event: EntityDonationReceived): void {
  let entity = NdaoEntity.load(event.address)
  if (entity == null) {
    // Log and skip
    log.error('Entity not found for donation received event: {}', [event.address.toHexString()])
    return
  }

  const totalDonated: BigInt = entity.totalUsdcDonationsReceived.plus(event.params.amountFee)
  entity.totalUsdcDonationsReceived = entity.totalUsdcDonationsReceived.plus(totalDonated)
  entity.totalUsdcContributionsReceived = entity.totalUsdcContributionsReceived.plus(totalDonated)

  entity.save()
}
