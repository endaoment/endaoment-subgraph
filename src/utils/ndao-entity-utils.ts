import { NdaoEntity } from '../../generated/schema'
import { Address, log } from '@graphprotocol/graph-ts'

export function loadNdaoEntityOrThrow(address: Address): NdaoEntity {
  // Fetch entity and ensure it exists
  let entity = NdaoEntity.load(address)
  if (entity == null) {
    log.error(
      'Entity {} not found for endaoment event. If you see this error, it is an indexing bug, since entities must ' +
        'exist in the database for donation events to start being indexed.',
      [address.toHexString()],
    )
    throw new Error('Indexing Error: Entity not found for donation event')
  }

  return entity
}
