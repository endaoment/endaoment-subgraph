import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import {
  EntityBalanceReconciled,
  EntityDonationReceived,
  EntityValueTransferred,
  EntityBalanceCorrected,
} from '../../generated/templates/NdaoEntity/NdaoEntity'
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
  const event = changetype<EntityDonationReceived>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = to

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)))
  event.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)))
  event.parameters.push(new ethereum.EventParam('tokenIn', ethereum.Value.fromAddress(tokenIn)))
  event.parameters.push(new ethereum.EventParam('amountIn', ethereum.Value.fromUnsignedBigInt(amountIn)))
  event.parameters.push(new ethereum.EventParam('amountReceived', ethereum.Value.fromUnsignedBigInt(amountReceived)))
  event.parameters.push(new ethereum.EventParam('amountFee', ethereum.Value.fromUnsignedBigInt(amountFee)))

  return event
}

export function mockBalance(address: Address, balance: i32): void {
  const ethValues: ethereum.Value[] = [ethereum.Value.fromI32(balance)]
  createMockedFunction(address, 'balance', 'balance():(uint256)').returns(
    // @ts-ignore - Ignore error due to graph-ts mismatch
    ethValues,
  )
}

export function mockOrgId(address: Address, ein: string): void {
  const ethValues: ethereum.Value[] = [ethereum.Value.fromBytes(Bytes.fromUTF8(ein))]
  createMockedFunction(address, 'orgId', 'orgId():(bytes32)').returns(
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
  const event = changetype<EntityValueTransferred>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = from

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)))
  event.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)))
  event.parameters.push(new ethereum.EventParam('amountReceived', ethereum.Value.fromUnsignedBigInt(amountReceived)))
  event.parameters.push(new ethereum.EventParam('amountFee', ethereum.Value.fromUnsignedBigInt(amountFee)))

  return event
}

export function createDefaultBalanceReconciledEvent(
  entity: Address,
  amountReceived: u64,
  blockNumber: i32 = 1,
): EntityBalanceReconciled {
  const amountInBi = BigInt.fromU64(amountReceived)
  const fee = amountInBi.times(BigInt.fromI32(5)).div(BigInt.fromI32(1000)) // 0.5% fee
  return createEntityBalanceReconciledEvent(entity, amountInBi, fee, blockNumber)
}

export function createEntityBalanceReconciledEvent(
  entity: Address,
  amountReceived: BigInt,
  amountFee: BigInt,
  blockNumber: i32 = 1,
): EntityBalanceReconciled {
  const event = changetype<EntityBalanceReconciled>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = entity

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)))
  event.parameters.push(new ethereum.EventParam('amountReceived', ethereum.Value.fromUnsignedBigInt(amountReceived)))
  event.parameters.push(new ethereum.EventParam('amountFee', ethereum.Value.fromUnsignedBigInt(amountFee)))

  return event
}

export function createEntityBalanceCorrectedEvent(
  entity: Address,
  newBalance: u64,
  blockNumber: i32 = 1,
): EntityBalanceCorrected {
  const donationEvent = changetype<EntityBalanceCorrected>(newMockEvent())
  donationEvent.block.number = BigInt.fromI32(blockNumber)

  donationEvent.address = entity

  donationEvent.parameters = []
  donationEvent.parameters.push(new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)))
  donationEvent.parameters.push(
    new ethereum.EventParam('newBalance', ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(newBalance))),
  )

  return donationEvent
}
