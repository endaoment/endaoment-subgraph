import {
  FactoryApprovalSet,
  OwnershipChanged,
  PortfolioStatusSet,
  PublicCapabilityUpdated,
  RoleCapabilityUpdated,
  SwapWrapperStatusSet,
  UserRoleUpdated,
} from '../../generated/Registry/Registry'
import { resolveAuthorityUser, resolveCapability, resolveRegistry, resolveRole } from '../utils/registry-utils'
import { remove } from '../utils/arrays'
import { AuthorityUser, RoleCapability, RoleUser } from '../../generated/schema'
import { store } from '@graphprotocol/graph-ts'

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

export function handleOwnershipChanged(event: OwnershipChanged): void {
  const registry = resolveRegistry(event.address)
  registry.owner = event.params.newOwner
  registry.save()
}

export function handleRoleCapabilityUpdated(event: RoleCapabilityUpdated): void {
  // Resolve elementary entities.
  const capability = resolveCapability(event.params.target, event.params.functionSig)
  const role = resolveRole(event.params.role)
  const roleCapabilityId = `${role.id}|${capability.id}`

  let roleCapability = RoleCapability.load(roleCapabilityId)
  if (!event.params.enabled) {
    // If the RoleCapability relationship already exists, and we are disabling it, delete it.
    if (roleCapability) {
      store.remove('RoleCapability', roleCapabilityId)
    }

    return
  }

  // If the RoleCapability relationship already exists, and we are enabling it again, simply return
  if (roleCapability) {
    return
  }

  // Otherwise, bind capability to the role.
  roleCapability = new RoleCapability(roleCapabilityId)
  roleCapability.role = role.id
  roleCapability.capability = capability.id
  roleCapability.save()
}

export function handleUserRoleUpdated(event: UserRoleUpdated): void {
  // Resolve elementary entities.
  let authorityUser = resolveAuthorityUser(event.params.user)
  const role = resolveRole(event.params.role)

  const roleUserId = `${authorityUser.id}|${role.id}`
  let roleUser = RoleUser.load(roleUserId)

  if (!event.params.enabled) {
    // If the RoleUser relationship already exists, and we are disabling it, delete it.
    if (roleUser) {
      store.remove('RoleUser', roleUserId)
    }

    return
  }

  // If the RoleUser relationship already exists, and we are enabling it again, simply return
  if (roleUser) {
    return
  }

  // Otherwise, bind user to the role.
  roleUser = new RoleUser(roleUserId)
  roleUser.role = role.id
  roleUser.user = authorityUser.id
  roleUser.save()
}

export function handlePublicCapabilityUpdated(event: PublicCapabilityUpdated): void {}
