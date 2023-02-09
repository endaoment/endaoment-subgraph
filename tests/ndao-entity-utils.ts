import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { newMockEvent } from 'matchstick-as'

export type EventContext = {
  block: ethereum.Block
  transaction: ethereum.Transaction
  receipt: ethereum.TransactionReceipt | null
}

export function createEntityDonationReceivedEvent(
  from: Address,
  to: Address,
  tokenIn: Address,
  amountIn: BigInt,
  amountReceived: BigInt,
  amountFee: BigInt,
  context?: EventContext,
): EntityDonationReceived {
  const donationEvent = changetype<EntityDonationReceived>(newMockEvent())

  if (context) {
    donationEvent.block = context.block
    donationEvent.transaction = context.transaction
    donationEvent.receipt = context.receipt
  }

  donationEvent.parameters = []
  donationEvent.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)))
  donationEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)))
  donationEvent.parameters.push(new ethereum.EventParam('tokenIn', ethereum.Value.fromAddress(tokenIn)))
  donationEvent.parameters.push(new ethereum.EventParam('amountIn', ethereum.Value.fromUnsignedBigInt(amountIn)))
  donationEvent.parameters.push(
    new ethereum.EventParam('amountReceived', ethereum.Value.fromUnsignedBigInt(amountReceived)),
  )
  donationEvent.parameters.push(new ethereum.EventParam('amountFee', ethereum.Value.fromUnsignedBigInt(amountFee)))

  return donationEvent
}
