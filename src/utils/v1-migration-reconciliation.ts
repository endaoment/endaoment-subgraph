import { NdaoEntity } from '../../generated/schema'
import { BigInt, ethereum } from '@graphprotocol/graph-ts'
import { NdaoEntity as NdaoEntityContract } from '../../generated/templates/NdaoEntity/NdaoEntity'

export function reconcileV1Migration(entity: NdaoEntity, currentBalanceChange: BigInt, event: ethereum.Event) {
  // If any assets was already recognized for the entity, then any potential migration has already been
  // recognized by other mappers.

  // TODO: Change this to an initialized flag
  if (entity.totalUsdcDonationsReceived != BigInt.fromI32(0)) {
    return
  }

  // Algorithm to figure out how much we should incorporate migrated assets into the balance:
  // 1 - Sum the balance delta for all events on the current block
  // 2 - Keep updating and adjusting the totalUsdcReceived as events come in.
  // 3 - Once block flips, if the current balance cannot be explained by 0 + PreviousBlockDelta, then the difference was
  //     migrated from V1. Register it accordingly
  // 4 - Mark entity as initialized to prevent migration check code from running again.
  // NOTE: This assumes that contract calls fetch state at the end of current block. Experiment with this to confirm.
  const number = event.block.number

  // TODO: Answer the question below about contract calls and decide if this reconciliation is even feasible.
  //  If it is, offset the balance change being indexed against the latest recognized balance
  const contract = NdaoEntityContract.bind(entity.id)
  const recognizedUsdcBalance = contract.balance()

  // The graph protocol says that calls to contracts fetch information at the current block. But what do they mean
  //  by current block? https://thegraph.com/docs/en/developing/assemblyscript-api/#access-to-smart-contract-state
  //  1. Latest block?
  //  2. Block that the event was emitted in?
  // Looks like it is about the block being indexed, but I must experiment with that before making assumptions.

  // EXPERIMENT:
  // 1. Setup the test hardhat node with the test local protocol
  // 2. Do a batch deployment and add log statements to the mapping function.
  // 3. Verify that in the batch deployment processing logs, the state being queried always matches the end of the block

  if (recognizedUsdcBalance == BigInt.fromI32(0)) {
  }
}
