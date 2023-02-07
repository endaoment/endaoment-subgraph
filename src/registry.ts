import { BigInt } from "@graphprotocol/graph-ts"
import {
  Registry,
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
  UserRoleUpdated
} from "../generated/Registry/Registry"
import { ExampleEntity } from "../generated/schema"

export function handleAuthorityUpdated(event: AuthorityUpdated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from)

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count.plus(BigInt.fromI32(1))

  // Entity fields can be set based on event parameters
  entity.user = event.params.user
  entity.newAuthority = event.params.newAuthority

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.authority(...)
  // - contract.baseToken(...)
  // - contract.canCall(...)
  // - contract.doesRoleHaveCapability(...)
  // - contract.doesUserHaveRole(...)
  // - contract.getDonationFee(...)
  // - contract.getDonationFeeWithOverrides(...)
  // - contract.getPayoutFee(...)
  // - contract.getPayoutFeeWithOverrides(...)
  // - contract.getRolesWithCapability(...)
  // - contract.getTransferFee(...)
  // - contract.getTransferFeeWithOverrides(...)
  // - contract.getUserRoles(...)
  // - contract.isActiveEntity(...)
  // - contract.isActivePortfolio(...)
  // - contract.isApprovedFactory(...)
  // - contract.isCapabilityPublic(...)
  // - contract.isSwapperSupported(...)
  // - contract.owner(...)
  // - contract.pendingOwner(...)
  // - contract.treasury(...)
}

export function handleDefaultDonationFeeSet(
  event: DefaultDonationFeeSet
): void {}

export function handleDefaultPayoutFeeSet(event: DefaultPayoutFeeSet): void {}

export function handleDefaultTransferFeeSet(
  event: DefaultTransferFeeSet
): void {}

export function handleDonationFeeReceiverOverrideSet(
  event: DonationFeeReceiverOverrideSet
): void {}

export function handleEntityStatusSet(event: EntityStatusSet): void {}

export function handleFactoryApprovalSet(event: FactoryApprovalSet): void {}

export function handleOwnerUpdated(event: OwnerUpdated): void {}

export function handleOwnershipChanged(event: OwnershipChanged): void {}

export function handleOwnershipTransferProposed(
  event: OwnershipTransferProposed
): void {}

export function handlePayoutFeeOverrideSet(event: PayoutFeeOverrideSet): void {}

export function handlePortfolioStatusSet(event: PortfolioStatusSet): void {}

export function handlePublicCapabilityUpdated(
  event: PublicCapabilityUpdated
): void {}

export function handleRoleCapabilityUpdated(
  event: RoleCapabilityUpdated
): void {}

export function handleSwapWrapperStatusSet(event: SwapWrapperStatusSet): void {}

export function handleTransferFeeReceiverOverrideSet(
  event: TransferFeeReceiverOverrideSet
): void {}

export function handleTransferFeeSenderOverrideSet(
  event: TransferFeeSenderOverrideSet
): void {}

export function handleTreasuryChanged(event: TreasuryChanged): void {}

export function handleUserRoleUpdated(event: UserRoleUpdated): void {}
