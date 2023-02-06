import { EntityDeployed as EntityDeployedEvent } from "../generated/OrgFundFactory/OrgFundFactory"
import { EntityDeployed } from "../generated/schema"

export function handleEntityDeployed(event: EntityDeployedEvent): void {
  let entity = new EntityDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.entity = event.params.entity
  entity.entityType = event.params.entityType
  entity.entityManager = event.params.entityManager

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
