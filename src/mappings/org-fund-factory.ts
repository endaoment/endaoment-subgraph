import { EntityDeployed as EntityDeployedEvent } from '../../generated/OrgFundFactory/OrgFundFactory'
import { NdaoEntity } from '../../generated/schema'
import { BigInt, log } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityTemplate } from '../../generated/templates'
import { convertEntityType } from '../utils/on-chain-entity-type'

export function handleEntityDeployed(event: EntityDeployedEvent): void {
  let entity = new NdaoEntity(event.params.entity)

  entity.entityType = convertEntityType(event.params.entityType)
  if (entity.entityType === 'Unknown') {
    log.warning('Unknown entity type: {}', [event.params.entityType.toString()])
  }

  entity.entityManager = event.params.entityManager

  // Initialize balances to 0
  entity.recognizedUsdcBalance = BigInt.fromI32(0)
  entity.investmentBalance = BigInt.fromI32(0)
  entity.totalUsdcDonationsReceived = BigInt.fromI32(0)
  entity.totalUsdcDonationFees = BigInt.fromI32(0)
  entity.totalUsdcGrantsReceived = BigInt.fromI32(0)
  entity.totalUsdcGrantInFees = BigInt.fromI32(0)
  entity.totalUsdcContributionsReceived = BigInt.fromI32(0)
  entity.totalUsdcContributionFees = BigInt.fromI32(0)
  entity.totalUsdcTransfersReceived = BigInt.fromI32(0)
  entity.totalUsdcTransferInFees = BigInt.fromI32(0)
  entity.totalUsdcMigrated = BigInt.fromI32(0)
  entity.totalUsdcReceived = BigInt.fromI32(0)
  entity.totalUsdcReceivedFees = BigInt.fromI32(0)
  entity.totalUsdcGrantedOut = BigInt.fromI32(0)
  entity.totalUsdcGrantedOutFees = BigInt.fromI32(0)
  entity.totalUsdcTransferredOut = BigInt.fromI32(0)
  entity.totalUsdcTransferredOutFees = BigInt.fromI32(0)
  entity.totalUsdcPaidOut = BigInt.fromI32(0)
  entity.totalUsdcPaidOutFees = BigInt.fromI32(0)
  entity.initialized = false

  // Save entity
  entity.save()

  // Start indexing events from the new entity
  NdaoEntityTemplate.create(event.params.entity)
}
