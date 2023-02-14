import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import {
  EntityBalanceReconciled,
  EntityDonationReceived,
  EntityValueTransferred,
  EntityBalanceCorrected,
  EntityValuePaidOut,
  EntityDeposit,
  EntityRedeem,
} from '../../generated/templates/NdaoEntity/NdaoEntity'
import { createMockedFunction, newMockEvent } from 'matchstick-as'

export const DEFAULT_DONOR_ADDRESS = Address.fromString('0xe5Ce376f2904C780E6F006213719B38b73E286D7')
export const DEFAULT_ENTITY_ADDRESS = Address.fromString('0xDf6b465463eA501cAccBcdf895AaDEfc5726FbF0')
export const DEFAULT_FUND_ADDRESS = Address.fromString('0x9f2E8FAC6dec33233d8864b48319032a753151B7')
export const DEFAULT_ORG_ADDRESS = DEFAULT_ENTITY_ADDRESS
export const DEFAULT_ORG2_ADDRESS = Address.fromString('0x52CD08D2E2BBB0623515A0b61fB7890cf106b19E')
export const EXTERNAL_ADDRESS = Address.fromString('0x159aeBc6CDE21B5509eD6C96F02F951D696E2ca5')
export const PORTFOLIO_1_ADDRESS = Address.fromString('0x164F81F81ea3b8505F330D112779763Fa5FDDD5a')
export const PORTFOLIO_2_ADDRESS = Address.fromString('0xad2009019B94E3E66028361c84539af601f1937D')
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

export function mockBalance(address: Address, balance: u64): void {
  const ethValues: ethereum.Value[] = [ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(balance))]
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
  const event = changetype<EntityBalanceCorrected>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = entity

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)))
  event.parameters.push(
    new ethereum.EventParam('newBalance', ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(newBalance))),
  )

  return event
}

export function createDefaultValuePaidOutEvent(
  from: Address,
  to: Address,
  amountSent: u64,
  blockNumber: i32 = 1,
): EntityValuePaidOut {
  const amountSentBi = BigInt.fromU64(amountSent)
  const fee = amountSentBi.times(BigInt.fromI32(5)).div(BigInt.fromI32(1000)) // 0.5% fee
  return createEntityValuePaidOutEvent(from, to, amountSentBi, fee, blockNumber)
}

export function createEntityValuePaidOutEvent(
  from: Address,
  to: Address,
  amountSent: BigInt,
  amountFee: BigInt,
  blockNumber: i32 = 1,
): EntityValuePaidOut {
  const event = changetype<EntityValuePaidOut>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = from

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)))
  event.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(from)))
  event.parameters.push(new ethereum.EventParam('amountSent', ethereum.Value.fromUnsignedBigInt(amountSent)))
  event.parameters.push(new ethereum.EventParam('amountFee', ethereum.Value.fromUnsignedBigInt(amountFee)))

  return event
}

export function createEntityDepositEvent(
  source: Address,
  portfolio: Address,
  baseTokenDeposited: u64,
  sharesReceived: u64,
  blockNumber: i32 = 1,
): EntityDeposit {
  const event = changetype<EntityDeposit>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = source

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('portfolio', ethereum.Value.fromAddress(portfolio)))
  event.parameters.push(
    new ethereum.EventParam(
      'baseTokenDeposited',
      ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(baseTokenDeposited)),
    ),
  )
  event.parameters.push(
    new ethereum.EventParam('sharesReceived', ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(sharesReceived))),
  )

  return event
}

export function createEntityRedeemEvent(
  source: Address,
  portfolio: Address,
  sharesRedeemed: u64,
  baseTokenReceived: u64,
  blockNumber: i32 = 1,
): EntityRedeem {
  const event = changetype<EntityRedeem>(newMockEvent())
  event.block.number = BigInt.fromI32(blockNumber)

  event.address = source

  event.parameters = []
  event.parameters.push(new ethereum.EventParam('portfolio', ethereum.Value.fromAddress(portfolio)))
  event.parameters.push(
    new ethereum.EventParam('sharesRedeemed', ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(sharesRedeemed))),
  )
  event.parameters.push(
    new ethereum.EventParam('baseTokenReceived', ethereum.Value.fromUnsignedBigInt(BigInt.fromU64(baseTokenReceived))),
  )

  return event
}
