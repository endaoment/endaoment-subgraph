import { EntityDeployed as EntityDeployedEvent } from '../../generated/OrgFundFactory/OrgFundFactory'
import { NdaoEntity } from '../../generated/schema'
import { BigInt, log } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityTemplate } from '../../generated/templates'

enum OnChainNdaoEntityType {
  Org = 1,
  Fund = 2,
}

function convertEntityType(entityType: OnChainNdaoEntityType): string {
  switch (entityType) {
    case OnChainNdaoEntityType.Org:
      return 'Org'
    case OnChainNdaoEntityType.Fund:
      return 'Fund'
    default:
      return 'Unknown'
  }
}

export function handleEntityDeployed(event: EntityDeployedEvent): void {
  let entity = new NdaoEntity(event.params.entity)

  entity.entityType = convertEntityType(event.params.entityType)
  entity.entityManager = event.params.entityManager

  // Initialize balances to 0
  entity.recognizedUsdcBalance = BigInt.fromI32(0)
  entity.investmentBalance = BigInt.fromI32(0)
  entity.totalUsdcDonationsReceived = BigInt.fromI32(0)
  entity.totalUsdcDonationsFee = BigInt.fromI32(0)
  entity.totalUsdcGrantsReceived = BigInt.fromI32(0)
  entity.totalUsdcGrantsInFee = BigInt.fromI32(0)
  entity.totalUsdcContributionsReceived = BigInt.fromI32(0)
  entity.totalUsdcContributionsFee = BigInt.fromI32(0)
  entity.totalUsdcTransfersReceived = BigInt.fromI32(0)
  entity.totalUsdcTransfersFee = BigInt.fromI32(0)
  entity.totalUsdcReceived = BigInt.fromI32(0)
  entity.totalUsdcReceivedFees = BigInt.fromI32(0)
  entity.totalUsdcGrantedOut = BigInt.fromI32(0)
  entity.totalUsdcGrantedOutFees = BigInt.fromI32(0)
  entity.totalUsdcTransferredOut = BigInt.fromI32(0)
  entity.totalUsdcTransferredOutFees = BigInt.fromI32(0)
  entity.totalUsdcPaidOut = BigInt.fromI32(0)
  entity.totalUsdcPaidOutFees = BigInt.fromI32(0)

  // Save entity
  entity.save()

  // Start indexing events from the new entity
  NdaoEntityTemplate.create(event.params.entity)
}
