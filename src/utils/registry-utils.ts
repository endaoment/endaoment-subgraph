import { Address, Bytes } from '@graphprotocol/graph-ts'
import { Capability, Registry } from '../../generated/schema'
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

export function resolveCapability(target: Address, signature: Bytes): Capability {
  const id = `${target.toHex()}|${signature.toHex()}`
  let capability = Capability.load(id)
  if (capability) {
    return capability
  }

  capability = new Capability(id)
  capability.target = target
  capability.signature = signature
  capability.save()

  return capability
}
