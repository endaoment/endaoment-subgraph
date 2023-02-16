import { Address } from '@graphprotocol/graph-ts'
import { Registry } from '../../generated/schema'
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
  registry.save()

  return registry
}
