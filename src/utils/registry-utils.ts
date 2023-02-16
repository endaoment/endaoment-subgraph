import { Address, Bytes } from '@graphprotocol/graph-ts'
import { AuthorityUser, Capability, Registry, Role } from '../../generated/schema'
import { Registry as RegistryContract } from '../../generated/Registry/Registry'

export function resolveRegistry(address: Address): Registry {
  // If singleton already exists, return it.
  let registry = Registry.load('1')
  if (registry) {
    return registry
  }

  // Otherwise, create it.
  const contract = RegistryContract.bind(address)
  registry = new Registry('1')
  registry.address = address
  registry.owner = contract.owner()
  registry.swapWrappers = []
  registry.entityFactories = []
  registry.portfolios = []
  registry.save()

  return registry
}

export function toCapabilityId(target: Address, signature: Bytes): string {
  return `${target.toHex()}|${signature.toHex()}`
}

export function resolveCapability(target: Address, signature: Bytes): Capability {
  const id = toCapabilityId(target, signature)
  let capability = Capability.load(id)
  if (capability) {
    return capability
  }

  capability = new Capability(id)
  capability.target = target
  capability.signature = signature
  capability.isPublic = false
  capability.save()

  return capability
}

export function resolveRole(roleId: i32): Role {
  const rId = roleId.toString()
  let role = Role.load(rId)
  if (role) {
    return role
  }

  role = new Role(rId)
  role.save()

  return role
}

export function resolveAuthorityUser(address: Address): AuthorityUser {
  let authorityUser = AuthorityUser.load(address)
  if (authorityUser) {
    return authorityUser
  }

  authorityUser = new AuthorityUser(address)
  authorityUser.save()

  return authorityUser
}
