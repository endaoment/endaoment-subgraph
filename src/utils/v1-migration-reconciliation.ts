import { NdaoEntity, NdaoEntityFirstIndexedBlock } from '../../generated/schema'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'

export function reconcileV1Migration(entity: NdaoEntity, currentBalanceChange: BigInt, event: ethereum.Event): void {
  // If entity is deemed initialized, then we don't need to run the migration reconciliation code
  if (entity.initialized) {
    return
  }

  // Fetch migration metadata entity
  const blockNumber = event.block.number
  let firstIndexedBlock = NdaoEntityFirstIndexedBlock.load(entity.id)

  if (firstIndexedBlock) {
    // Ensure the current block number is never lower thant the first indexed block for the entity. If that ever occurs,
    // it means that the indexer went back in time, which shouldn't be possible.
    if (blockNumber < firstIndexedBlock.blockNumber) {
      throw new Error(
        `FATAL ERROR: Block number of first indexed block (${firstIndexedBlock.blockNumber.toString()}) is` +
          `greater than current block number (${blockNumber.toString()})`,
      )
    }

    // If we are in a block after the first indexed block, we know we have all the events that occurred in that block.
    if (firstIndexedBlock.blockNumber < blockNumber) {
      // We consider an amount migrated if the balance at the end of the first indexed block cannot be explained
      // by the sum of all the events that occurred in that block. This because migration is the only event that can
      // change the balance of the contract without emitting an V2 event.
      const unexplainedBalance = firstIndexedBlock.endOfBlockBalance.minus(firstIndexedBlock.eventBalanceDelta)
      if (unexplainedBalance.gt(BigInt.fromI32(0))) {
        entity.totalUsdcMigrated = unexplainedBalance
        entity.totalUsdcReceived = entity.totalUsdcReceived.plus(unexplainedBalance)
      }

      entity.initialized = true
      entity.save()
      return
    }
  }

  // If this is the first event of the first block, create the necessary migration metadata entity to track all balance
  // changes on the block.
  if (firstIndexedBlock == null) {
    firstIndexedBlock = new NdaoEntityFirstIndexedBlock(entity.id)
    const contract = NdaoEntityContract.bind(Address.fromBytes(entity.id))

    // The graph docs state that calls to contracts fetch information at the end of the current block. This means that
    // if we call the contract at any moment while processing events, we should get the state of the contract at the end
    // of the block, not the state at the moment the event is being processed. This was proved experimentally in this
    // repository. For more information, see the following link:
    // https://thegraph.com/docs/en/developing/assemblyscript-api/#access-to-smart-contract-state
    firstIndexedBlock.endOfBlockBalance = contract.balance()
    firstIndexedBlock.blockNumber = blockNumber
    firstIndexedBlock.eventBalanceDelta = BigInt.fromI32(0)
  }

  // Add the current balance change to the total balance change in the block
  firstIndexedBlock.eventBalanceDelta = firstIndexedBlock.eventBalanceDelta.plus(currentBalanceChange)
  firstIndexedBlock.save()

  return
}
