import { newMockEvent } from 'matchstick-as'
import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts'
import { EntityDeployed } from '../../generated/OrgFundFactory/OrgFundFactory'

export function createEntityDeployedEvent(entity: Address, entityType: i32, entityManager: Address): EntityDeployed {
  let entityDeployedEvent = changetype<EntityDeployed>(newMockEvent())

  entityDeployedEvent.parameters = []

  entityDeployedEvent.parameters.push(new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)))
  entityDeployedEvent.parameters.push(
    new ethereum.EventParam('entityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(entityType))),
  )
  entityDeployedEvent.parameters.push(
    new ethereum.EventParam('entityManager', ethereum.Value.fromAddress(entityManager)),
  )

  return entityDeployedEvent
}
