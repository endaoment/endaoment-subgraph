import {
  FactoryApprovalSet,
  OwnershipChanged,
  PortfolioStatusSet,
  PublicCapabilityUpdated,
  RoleCapabilityUpdated,
  SwapWrapperStatusSet,
  UserRoleUpdated,
} from '../../generated/Registry/Registry'

export function handleFactoryApprovalSet(event: FactoryApprovalSet): void {}

export function handleSwapWrapperStatusSet(event: SwapWrapperStatusSet): void {}

export function handlePortfolioStatusSet(event: PortfolioStatusSet): void {}

export function handleOwnershipChanged(event: OwnershipChanged): void {}

export function handleUserRoleUpdated(event: UserRoleUpdated): void {}

export function handlePublicCapabilityUpdated(event: PublicCapabilityUpdated): void {}

export function handleRoleCapabilityUpdated(event: RoleCapabilityUpdated): void {}
