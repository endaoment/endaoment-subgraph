import { createMockedFunction, newMockEvent } from 'matchstick-as'
import { ethereum, Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  AuthorityUpdated,
  DefaultDonationFeeSet,
  DefaultPayoutFeeSet,
  DefaultTransferFeeSet,
  DonationFeeReceiverOverrideSet,
  EntityStatusSet,
  FactoryApprovalSet,
  OwnerUpdated,
  OwnershipChanged,
  OwnershipTransferProposed,
  PayoutFeeOverrideSet,
  PortfolioStatusSet,
  PublicCapabilityUpdated,
  RoleCapabilityUpdated,
  SwapWrapperStatusSet,
  TransferFeeReceiverOverrideSet,
  TransferFeeSenderOverrideSet,
  TreasuryChanged,
  UserRoleUpdated,
} from '../../generated/Registry/Registry'

export const REGISTRY_ADDRESS = Address.fromString('0xB533e61a8279d9f8909d6718a1B5227dbD52929B')

export function createAuthorityUpdatedEvent(user: Address, newAuthority: Address): AuthorityUpdated {
  let authorityUpdatedEvent = changetype<AuthorityUpdated>(newMockEvent())

  authorityUpdatedEvent.parameters = new Array()

  authorityUpdatedEvent.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(user)))
  authorityUpdatedEvent.parameters.push(
    new ethereum.EventParam('newAuthority', ethereum.Value.fromAddress(newAuthority)),
  )

  return authorityUpdatedEvent
}

export function createDefaultDonationFeeSetEvent(entityType: i32, fee: BigInt): DefaultDonationFeeSet {
  let defaultDonationFeeSetEvent = changetype<DefaultDonationFeeSet>(newMockEvent())

  defaultDonationFeeSetEvent.parameters = new Array()

  defaultDonationFeeSetEvent.parameters.push(
    new ethereum.EventParam('entityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(entityType))),
  )
  defaultDonationFeeSetEvent.parameters.push(new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)))

  return defaultDonationFeeSetEvent
}

export function createDefaultPayoutFeeSetEvent(entityType: i32, fee: BigInt): DefaultPayoutFeeSet {
  let defaultPayoutFeeSetEvent = changetype<DefaultPayoutFeeSet>(newMockEvent())

  defaultPayoutFeeSetEvent.parameters = new Array()

  defaultPayoutFeeSetEvent.parameters.push(
    new ethereum.EventParam('entityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(entityType))),
  )
  defaultPayoutFeeSetEvent.parameters.push(new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)))

  return defaultPayoutFeeSetEvent
}

export function createDefaultTransferFeeSetEvent(
  fromEntityType: i32,
  toEntityType: i32,
  fee: BigInt,
): DefaultTransferFeeSet {
  let defaultTransferFeeSetEvent = changetype<DefaultTransferFeeSet>(newMockEvent())

  defaultTransferFeeSetEvent.parameters = new Array()

  defaultTransferFeeSetEvent.parameters.push(
    new ethereum.EventParam('fromEntityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(fromEntityType))),
  )
  defaultTransferFeeSetEvent.parameters.push(
    new ethereum.EventParam('toEntityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(toEntityType))),
  )
  defaultTransferFeeSetEvent.parameters.push(new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)))

  return defaultTransferFeeSetEvent
}

export function createDonationFeeReceiverOverrideSetEvent(
  entity: Address,
  fee: BigInt,
): DonationFeeReceiverOverrideSet {
  let donationFeeReceiverOverrideSetEvent = changetype<DonationFeeReceiverOverrideSet>(newMockEvent())

  donationFeeReceiverOverrideSetEvent.parameters = new Array()

  donationFeeReceiverOverrideSetEvent.parameters.push(
    new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)),
  )
  donationFeeReceiverOverrideSetEvent.parameters.push(
    new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)),
  )

  return donationFeeReceiverOverrideSetEvent
}

export function createEntityStatusSetEvent(entity: Address, isActive: boolean): EntityStatusSet {
  let entityStatusSetEvent = changetype<EntityStatusSet>(newMockEvent())

  entityStatusSetEvent.parameters = new Array()

  entityStatusSetEvent.parameters.push(new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)))
  entityStatusSetEvent.parameters.push(new ethereum.EventParam('isActive', ethereum.Value.fromBoolean(isActive)))

  return entityStatusSetEvent
}

export function createFactoryApprovalSetEvent(factory: Address, isApproved: boolean): FactoryApprovalSet {
  let factoryApprovalSetEvent = changetype<FactoryApprovalSet>(newMockEvent())

  factoryApprovalSetEvent.parameters = new Array()
  factoryApprovalSetEvent.address = REGISTRY_ADDRESS

  factoryApprovalSetEvent.parameters.push(new ethereum.EventParam('factory', ethereum.Value.fromAddress(factory)))
  factoryApprovalSetEvent.parameters.push(new ethereum.EventParam('isApproved', ethereum.Value.fromBoolean(isApproved)))

  return factoryApprovalSetEvent
}

export function createOwnerUpdatedEvent(user: Address, newOwner: Address): OwnerUpdated {
  let ownerUpdatedEvent = changetype<OwnerUpdated>(newMockEvent())

  ownerUpdatedEvent.parameters = new Array()

  ownerUpdatedEvent.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(user)))
  ownerUpdatedEvent.parameters.push(new ethereum.EventParam('newOwner', ethereum.Value.fromAddress(newOwner)))

  return ownerUpdatedEvent
}

export function createOwnershipChangedEvent(owner: Address, newOwner: Address): OwnershipChanged {
  let ownershipChangedEvent = changetype<OwnershipChanged>(newMockEvent())

  ownershipChangedEvent.parameters = new Array()

  ownershipChangedEvent.address = REGISTRY_ADDRESS
  ownershipChangedEvent.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(owner)))
  ownershipChangedEvent.parameters.push(new ethereum.EventParam('newOwner', ethereum.Value.fromAddress(newOwner)))

  return ownershipChangedEvent
}

export function createOwnershipTransferProposedEvent(user: Address, newOwner: Address): OwnershipTransferProposed {
  let ownershipTransferProposedEvent = changetype<OwnershipTransferProposed>(newMockEvent())

  ownershipTransferProposedEvent.parameters = new Array()

  ownershipTransferProposedEvent.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(user)))
  ownershipTransferProposedEvent.parameters.push(
    new ethereum.EventParam('newOwner', ethereum.Value.fromAddress(newOwner)),
  )

  return ownershipTransferProposedEvent
}

export function createPayoutFeeOverrideSetEvent(entity: Address, fee: BigInt): PayoutFeeOverrideSet {
  let payoutFeeOverrideSetEvent = changetype<PayoutFeeOverrideSet>(newMockEvent())

  payoutFeeOverrideSetEvent.parameters = new Array()

  payoutFeeOverrideSetEvent.parameters.push(new ethereum.EventParam('entity', ethereum.Value.fromAddress(entity)))
  payoutFeeOverrideSetEvent.parameters.push(new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)))

  return payoutFeeOverrideSetEvent
}

export function createPortfolioStatusSetEvent(portfolio: Address, isActive: boolean): PortfolioStatusSet {
  let portfolioStatusSetEvent = changetype<PortfolioStatusSet>(newMockEvent())

  portfolioStatusSetEvent.parameters = new Array()
  portfolioStatusSetEvent.address = REGISTRY_ADDRESS

  portfolioStatusSetEvent.parameters.push(new ethereum.EventParam('portfolio', ethereum.Value.fromAddress(portfolio)))
  portfolioStatusSetEvent.parameters.push(new ethereum.EventParam('isActive', ethereum.Value.fromBoolean(isActive)))

  return portfolioStatusSetEvent
}

export function createPublicCapabilityUpdatedEvent(
  target: Address,
  functionSig: Bytes,
  enabled: boolean,
): PublicCapabilityUpdated {
  let publicCapabilityUpdatedEvent = changetype<PublicCapabilityUpdated>(newMockEvent())

  publicCapabilityUpdatedEvent.parameters = new Array()

  publicCapabilityUpdatedEvent.parameters.push(new ethereum.EventParam('target', ethereum.Value.fromAddress(target)))
  publicCapabilityUpdatedEvent.parameters.push(
    new ethereum.EventParam('functionSig', ethereum.Value.fromFixedBytes(functionSig)),
  )
  publicCapabilityUpdatedEvent.parameters.push(new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled)))

  return publicCapabilityUpdatedEvent
}

export function createRoleCapabilityUpdatedEvent(
  role: i32,
  target: Address,
  functionSig: Bytes,
  enabled: boolean,
): RoleCapabilityUpdated {
  let roleCapabilityUpdatedEvent = changetype<RoleCapabilityUpdated>(newMockEvent())

  roleCapabilityUpdatedEvent.parameters = new Array()
  roleCapabilityUpdatedEvent.address = REGISTRY_ADDRESS

  roleCapabilityUpdatedEvent.parameters.push(
    new ethereum.EventParam('role', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role))),
  )
  roleCapabilityUpdatedEvent.parameters.push(new ethereum.EventParam('target', ethereum.Value.fromAddress(target)))
  roleCapabilityUpdatedEvent.parameters.push(
    new ethereum.EventParam('functionSig', ethereum.Value.fromFixedBytes(functionSig)),
  )
  roleCapabilityUpdatedEvent.parameters.push(new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled)))

  return roleCapabilityUpdatedEvent
}

export function createSwapWrapperStatusSetEvent(swapWrapper: Address, isSupported: boolean): SwapWrapperStatusSet {
  let swapWrapperStatusSetEvent = changetype<SwapWrapperStatusSet>(newMockEvent())

  swapWrapperStatusSetEvent.parameters = new Array()
  swapWrapperStatusSetEvent.address = REGISTRY_ADDRESS

  swapWrapperStatusSetEvent.parameters.push(
    new ethereum.EventParam('swapWrapper', ethereum.Value.fromAddress(swapWrapper)),
  )
  swapWrapperStatusSetEvent.parameters.push(
    new ethereum.EventParam('isSupported', ethereum.Value.fromBoolean(isSupported)),
  )

  return swapWrapperStatusSetEvent
}

export function createTransferFeeReceiverOverrideSetEvent(
  fromEntityType: i32,
  toEntity: Address,
  fee: BigInt,
): TransferFeeReceiverOverrideSet {
  let transferFeeReceiverOverrideSetEvent = changetype<TransferFeeReceiverOverrideSet>(newMockEvent())

  transferFeeReceiverOverrideSetEvent.parameters = new Array()

  transferFeeReceiverOverrideSetEvent.parameters.push(
    new ethereum.EventParam('fromEntityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(fromEntityType))),
  )
  transferFeeReceiverOverrideSetEvent.parameters.push(
    new ethereum.EventParam('toEntity', ethereum.Value.fromAddress(toEntity)),
  )
  transferFeeReceiverOverrideSetEvent.parameters.push(
    new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)),
  )

  return transferFeeReceiverOverrideSetEvent
}

export function createTransferFeeSenderOverrideSetEvent(
  fromEntity: Address,
  toEntityType: i32,
  fee: BigInt,
): TransferFeeSenderOverrideSet {
  let transferFeeSenderOverrideSetEvent = changetype<TransferFeeSenderOverrideSet>(newMockEvent())

  transferFeeSenderOverrideSetEvent.parameters = new Array()

  transferFeeSenderOverrideSetEvent.parameters.push(
    new ethereum.EventParam('fromEntity', ethereum.Value.fromAddress(fromEntity)),
  )
  transferFeeSenderOverrideSetEvent.parameters.push(
    new ethereum.EventParam('toEntityType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(toEntityType))),
  )
  transferFeeSenderOverrideSetEvent.parameters.push(
    new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)),
  )

  return transferFeeSenderOverrideSetEvent
}

export function createTreasuryChangedEvent(oldTreasury: Address, newTreasury: Address): TreasuryChanged {
  let treasuryChangedEvent = changetype<TreasuryChanged>(newMockEvent())

  treasuryChangedEvent.parameters = new Array()

  treasuryChangedEvent.parameters.push(new ethereum.EventParam('oldTreasury', ethereum.Value.fromAddress(oldTreasury)))
  treasuryChangedEvent.parameters.push(new ethereum.EventParam('newTreasury', ethereum.Value.fromAddress(newTreasury)))

  return treasuryChangedEvent
}

export function createUserRoleUpdatedEvent(user: Address, role: i32, enabled: boolean): UserRoleUpdated {
  let userRoleUpdatedEvent = changetype<UserRoleUpdated>(newMockEvent())

  userRoleUpdatedEvent.parameters = new Array()
  userRoleUpdatedEvent.address = REGISTRY_ADDRESS

  userRoleUpdatedEvent.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(user)))
  userRoleUpdatedEvent.parameters.push(
    new ethereum.EventParam('role', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role))),
  )
  userRoleUpdatedEvent.parameters.push(new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled)))

  return userRoleUpdatedEvent
}

export function mockOwner(owner: Address): void {
  const ethValues: ethereum.Value[] = [ethereum.Value.fromAddress(owner)]
  createMockedFunction(REGISTRY_ADDRESS, 'owner', 'owner():(address)').returns(
    // @ts-ignore - Ignore error due to graph-ts mismatch
    ethValues,
  )
}
