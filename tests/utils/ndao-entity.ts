import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { EntityDonationReceived, EntityValueTransferred } from '../../generated/templates/NdaoEntity/NdaoEntity'
import { createMockedFunction, newMockEvent } from 'matchstick-as'

export const DEFAULT_DONOR_ADDRESS = Address.fromString('0xe5Ce376f2904C780E6F006213719B38b73E286D7')
export const DEFAULT_ENTITY_ADDRESS = Address.fromString('0xDf6b465463eA501cAccBcdf895AaDEfc5726FbF0')
export const DEFAULT_FUND_ADDRESS = Address.fromString('0x9f2E8FAC6dec33233d8864b48319032a753151B7')
export const DEFAULT_ORG_ADDRESS = DEFAULT_ENTITY_ADDRESS
export const DEFAULT_ORG2_ADDRESS = Address.fromString('0x52CD08D2E2BBB0623515A0b61fB7890cf106b19E')

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

  donationEvent.address = to

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

export function mockBalance(address: Address, balance: i32): void {
  const ethValues: ethereum.Value[] = [ethereum.Value.fromI32(balance)]
  createMockedFunction(address, 'balance', 'balance():(uint256)').returns(
    // @ts-ignore - Ignore error due to graph-ts mismatch
    ethValues,
  )
}

export function createDefaultValueTransferredEvent(
  from: Address,
  to: Address,
  amountReceived: u64,
  blockNumber: i32 = 1,
): EntityValueTransferred {
  const amountInBi = BigInt.fromU64(amountReceived)
  const fee = amountInBi.times(BigInt.fromI32(5)).div(BigInt.fromI32(1000)) // 0.5% fee
  return createEntityValueTransferred(from, to, amountInBi, fee, blockNumber)
}
export function createEntityValueTransferred(
  from: Address,
  to: Address,
  amountReceived: BigInt,
  amountFee: BigInt,
  blockNumber: i32 = 1,
): EntityValueTransferred {
  const donationEvent = changetype<EntityValueTransferred>(newMockEvent())
  donationEvent.block.number = BigInt.fromI32(blockNumber)

  donationEvent.address = from

  donationEvent.parameters = []
  donationEvent.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)))
  donationEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)))
  donationEvent.parameters.push(
    new ethereum.EventParam('amountReceived', ethereum.Value.fromUnsignedBigInt(amountReceived)),
  )
  donationEvent.parameters.push(new ethereum.EventParam('amountFee', ethereum.Value.fromUnsignedBigInt(amountFee)))

  return donationEvent
}
