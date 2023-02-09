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
  // 3 - Once block flips, if the end of block balance cannot be explained by 0 + PreviousBlockDelta, then the difference was
  //     migrated from V1. Register it accordingly
  // 4 - Mark entity as initialized to prevent migration check code from running again.
  const number = event.block.number

  const contract = NdaoEntityContract.bind(entity.id)
  const recognizedUsdcBalance = contract.balance()

  // The graph docs state that calls to contracts fetch information at the end of the current block. This means that
  // if we call the contract at any moment while processing events, we should get the state of the contract at the end
  // of the block, not the state at the moment the event is being processed. This was proved experimentally in this
  // repository. For more information, see the following link:
  // https://thegraph.com/docs/en/developing/assemblyscript-api/#access-to-smart-contract-state

  if (recognizedUsdcBalance == BigInt.fromI32(0)) {
  }
}
