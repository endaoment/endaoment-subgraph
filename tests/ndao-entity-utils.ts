import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { EntityDonationReceived } from '../generated/templates/NdaoEntity/NdaoEntity'
import { newMockEvent } from 'matchstick-as'

export const DEFAULT_DONOR_ADDRESS = Address.fromString('0xe5Ce376f2904C780E6F006213719B38b73E286D7')
export const DEFAULT_ENTITY_ADDRESS = Address.fromString('0xDf6b465463eA501cAccBcdf895AaDEfc5726FbF0')
export const TOKEN_IN = Address.fromString('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
export const DEFAULT_TOKEN_IN = BigInt.fromI64(10 ** 18)

export function createDefaultDonationEvent(
  to: Address,
  amountReceived: u64,
  blockNumber: i32 = 1,
): EntityDonationReceived {
  const amountInBi = BigInt.fromU64(amountReceived)
  const fee = amountInBi.times(BigInt.fromI32(5)).div(BigInt.fromI32(1000)) // 0.5% fee
  return createEntityDonationReceivedEvent(
    DEFAULT_DONOR_ADDRESS,
    to,
    TOKEN_IN,
    DEFAULT_TOKEN_IN,
    amountInBi,
    fee,
    blockNumber,
  )
}

export function createEntityDonationReceivedEvent(
  from: Address,
  to: Address,
  tokenIn: Address,
  amountIn: BigInt,
  amountReceived: BigInt,
  amountFee: BigInt,
  blockNumber: i32 = 1,
): EntityDonationReceived {
  const donationEvent = changetype<EntityDonationReceived>(newMockEvent())
  donationEvent.block.number = BigInt.fromI32(blockNumber)

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
