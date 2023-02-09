import { EntityDonationReceived } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { BigInt, log } from '@graphprotocol/graph-ts'
import { NdaoEntity } from '../../generated/schema'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'

export function handleEntityDonationReceived(event: EntityDonationReceived): void {
  let entity = NdaoEntity.load(event.address)

  // TODO: Should I let this fail?
  if (entity == null) {
    // Log and skip processing event if entity is not found to avoid subgraph from being clogged
    log.error('Entity not found for donation received event: {}', [event.address.toHexString()])
    return
  }

  // Since the initial asset migration from Endaoment V1 to Endaoment V2 did not emit adjustment events, we need to
  // initialize the balance using the accounting variable directly instead of relying only on events.

  // A negative side effect of the migration is that any Endaoment entity that did not emit an event in V2 will have
  // their balances zeroed on the subgraph.
  if (entity.totalUsdcReceived == BigInt.fromI32(0)) {
    const contract = NdaoEntityContract.bind(event.address)
    const recognizedUsdcBalance = contract.balance()

    // If the balance is not zero but the total received is, then we know that the entity has received assets from
    // V1 -> V2
    if (recognizedUsdcBalance != BigInt.fromI32(0)) {
      entity.totalUsdcReceived = recognizedUsdcBalance
      // TODO: Extract this to common function already and isolate concern
    }
  }

  // Math Checks
  // totalUsdcContributionsReceived = totalUsdcDonationsReceived + totalUsdcGrantsReceived
  // totalUsdcContributionsFee = totalUsdcDonationsFee + totalUsdcGrantsInFee
  // totalUsdcReceived = totalUsdcContributionsReceived + totalUsdcTransfersReceived
  // totalUsdcReceivedFees = totalUsdcContributionsFee + totalUsdcTransfersFee

  const totalDonated: BigInt = entity.totalUsdcDonationsReceived.plus(event.params.amountFee)
  entity.totalUsdcDonationsReceived = entity.totalUsdcDonationsReceived.plus(totalDonated)
  entity.totalUsdcContributionsReceived = entity.totalUsdcContributionsReceived.plus(totalDonated)

  entity.save()
}
