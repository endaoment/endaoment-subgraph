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
import { remove } from '../utils/arrays'

export function handleFactoryApprovalSet(event: FactoryApprovalSet): void {
  const registry = resolveRegistry(event.address)

  if (event.params.isApproved) {
    const array = registry.entityFactories
    array.push(event.params.factory)
    registry.entityFactories = array
  } else {
    registry.entityFactories = remove(registry.entityFactories, event.params.factory)
  }

  registry.save()
}

export function handleSwapWrapperStatusSet(event: SwapWrapperStatusSet): void {
  const registry = resolveRegistry(event.address)

  if (event.params.isSupported) {
    const array = registry.swapWrappers
    array.push(event.params.swapWrapper)
    registry.swapWrappers = array
  } else {
    registry.swapWrappers = remove(registry.swapWrappers, event.params.swapWrapper)
  }

  registry.save()
}

export function handlePortfolioStatusSet(event: PortfolioStatusSet): void {
  const registry = resolveRegistry(event.address)

  if (event.params.isActive) {
    const array = registry.portfolios
    array.push(event.params.portfolio)
    registry.portfolios = array
  } else {
    registry.portfolios = remove(registry.portfolios, event.params.portfolio)
  }

  registry.save()
}

export function handleOwnershipChanged(event: OwnershipChanged): void {}

export function handleUserRoleUpdated(event: UserRoleUpdated): void {}

export function handlePublicCapabilityUpdated(event: PublicCapabilityUpdated): void {}

export function handleRoleCapabilityUpdated(event: RoleCapabilityUpdated): void {}
