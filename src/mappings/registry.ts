import {
  FactoryApprovalSet,
  OwnershipChanged,
  PortfolioStatusSet,
  PublicCapabilityUpdated,
  RoleCapabilityUpdated,
  SwapWrapperStatusSet,
  UserRoleUpdated,
} from '../../generated/Registry/Registry'
import { resolveRegistry } from '../utils/registry-utils'

export function handleFactoryApprovalSet(event: FactoryApprovalSet): void {
  const registry = resolveRegistry(event.address)

  if (event.params.isApproved) {
    registry.entityFactories.push(event.params.factory)
  } else {
    registry.entityFactories = registry.entityFactories.filter((factory) => factory != event.params.factory)
  }

  registry.save()
}

export function handleSwapWrapperStatusSet(event: SwapWrapperStatusSet): void {
  const registry = resolveRegistry(event.address)

  if (event.params.isSupported) {
    registry.swapWrappers.push(event.params.swapWrapper)
  } else {
    registry.swapWrappers = registry.swapWrappers.filter((swapWrapper) => swapWrapper != event.params.swapWrapper)
  }

  registry.save()
}

export function handlePortfolioStatusSet(event: PortfolioStatusSet): void {}

export function handleOwnershipChanged(event: OwnershipChanged): void {}

export function handleUserRoleUpdated(event: UserRoleUpdated): void {}

export function handlePublicCapabilityUpdated(event: PublicCapabilityUpdated): void {}

export function handleRoleCapabilityUpdated(event: RoleCapabilityUpdated): void {}
