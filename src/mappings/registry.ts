import { BigInt } from '@graphprotocol/graph-ts'
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
  UserRoleUpdated,
} from '../../generated/Registry/Registry'

export function handleAuthorityUpdated(event: AuthorityUpdated): void {}

export function handleDefaultDonationFeeSet(event: DefaultDonationFeeSet): void {}

export function handleDefaultPayoutFeeSet(event: DefaultPayoutFeeSet): void {}

export function handleDefaultTransferFeeSet(event: DefaultTransferFeeSet): void {}

export function handleDonationFeeReceiverOverrideSet(event: DonationFeeReceiverOverrideSet): void {}

export function handleEntityStatusSet(event: EntityStatusSet): void {}

export function handleFactoryApprovalSet(event: FactoryApprovalSet): void {}

export function handleOwnerUpdated(event: OwnerUpdated): void {}

export function handleOwnershipChanged(event: OwnershipChanged): void {}

export function handleOwnershipTransferProposed(event: OwnershipTransferProposed): void {}

export function handlePayoutFeeOverrideSet(event: PayoutFeeOverrideSet): void {}

export function handlePortfolioStatusSet(event: PortfolioStatusSet): void {}

export function handlePublicCapabilityUpdated(event: PublicCapabilityUpdated): void {}

export function handleRoleCapabilityUpdated(event: RoleCapabilityUpdated): void {}

export function handleSwapWrapperStatusSet(event: SwapWrapperStatusSet): void {}

export function handleTransferFeeReceiverOverrideSet(event: TransferFeeReceiverOverrideSet): void {}

export function handleTransferFeeSenderOverrideSet(event: TransferFeeSenderOverrideSet): void {}

export function handleTreasuryChanged(event: TreasuryChanged): void {}

export function handleUserRoleUpdated(event: UserRoleUpdated): void {}
