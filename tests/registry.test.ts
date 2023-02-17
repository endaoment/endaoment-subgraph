import { assert, describe, test, clearStore, afterEach, beforeAll } from 'matchstick-as'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { AuthorityUser, Capability, NdaoEntity, Registry, Role, RoleCapability, RoleUser } from '../generated/schema'
import { mockOrgId } from './utils/ndao-entity'
import {
  handleFactoryApprovalSet,
  handleOwnershipChanged,
  handlePortfolioStatusSet,
  handlePublicCapabilityUpdated,
  handleRoleCapabilityUpdated,
  handleSwapWrapperStatusSet,
  handleUserRoleUpdated,
} from '../src/mappings/registry'
import {
  createFactoryApprovalSetEvent,
  createOwnershipChangedEvent,
  createPortfolioStatusSetEvent,
  createPublicCapabilityUpdatedEvent,
  createRoleCapabilityUpdatedEvent,
  createSwapWrapperStatusSetEvent,
  createUserRoleUpdatedEvent,
  mockOwner,
  REGISTRY_ADDRESS,
} from './utils/registry'

const OWNER = Address.fromString('0x3643c207f8441A1CBf7F35256c6DAE459E6d7bC7')

const ADDRESS_1 = Address.fromString('0x2E5fe8acac61DEC9f8DE982994f1573Ab2E3089C')
const ADDRESS_2 = Address.fromString('0x81F211f4A1c6Ade44a0bF9049F7A3a1F73C7a035')
const ADDRESS_3 = Address.fromString('0x4Bc8D97a7A91D5C62a74A8b06d5f79Ddd42389FF')
const ADDRESS_4 = Address.fromString('0x3b899C10914751a45b15C79a784124f2e318de1D')

describe('Registry', () => {
  beforeAll(() => {
    mockOwner(OWNER)
  })

  afterEach(() => {
    clearStore()
  })

  test('it should init Registry on first event', () => {
    // Act
    handleFactoryApprovalSet(createFactoryApprovalSetEvent(ADDRESS_1, true))

    // Assert
    let registry = Registry.load('1')
    if (!registry) throw new Error('Registry not found in store')

    assert.i32Equals(1, registry.entityFactories.length)
    assert.bytesEquals(ADDRESS_1, registry.entityFactories[0])
    assert.bytesEquals(OWNER, registry.owner)
    assert.bytesEquals(REGISTRY_ADDRESS, registry.address)
  })

  describe('Protocol Component Approvals', () => {
    test('it should register Factory approvals', () => {
      // Act
      handleFactoryApprovalSet(createFactoryApprovalSetEvent(ADDRESS_1, true))
      handleFactoryApprovalSet(createFactoryApprovalSetEvent(ADDRESS_2, true))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.i32Equals(2, registry.entityFactories.length)
      assert.bytesEquals(ADDRESS_1, registry.entityFactories[0])
      assert.bytesEquals(ADDRESS_2, registry.entityFactories[1])
    })

    test('it should register Factory removals', () => {
      // Act
      handleFactoryApprovalSet(createFactoryApprovalSetEvent(ADDRESS_1, true))
      handleFactoryApprovalSet(createFactoryApprovalSetEvent(ADDRESS_2, true))
      handleFactoryApprovalSet(createFactoryApprovalSetEvent(ADDRESS_1, false))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.i32Equals(1, registry.entityFactories.length)
      assert.bytesEquals(ADDRESS_2, registry.entityFactories[0])
    })

    test('it should register SwapWrapper approvals', () => {
      // Act
      handleSwapWrapperStatusSet(createSwapWrapperStatusSetEvent(ADDRESS_1, true))
      handleSwapWrapperStatusSet(createSwapWrapperStatusSetEvent(ADDRESS_2, true))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.i32Equals(2, registry.swapWrappers.length)
      assert.bytesEquals(ADDRESS_1, registry.swapWrappers[0])
      assert.bytesEquals(ADDRESS_2, registry.swapWrappers[1])
    })

    test('it should register SwapWrapper removals', () => {
      // Act
      handleSwapWrapperStatusSet(createSwapWrapperStatusSetEvent(ADDRESS_1, true))
      handleSwapWrapperStatusSet(createSwapWrapperStatusSetEvent(ADDRESS_2, true))
      handleSwapWrapperStatusSet(createSwapWrapperStatusSetEvent(ADDRESS_1, false))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.i32Equals(1, registry.swapWrappers.length)
      assert.bytesEquals(ADDRESS_2, registry.swapWrappers[0])
    })

    test('it should register Portfolio approvals', () => {
      // Act
      handlePortfolioStatusSet(createPortfolioStatusSetEvent(ADDRESS_1, true))
      handlePortfolioStatusSet(createPortfolioStatusSetEvent(ADDRESS_2, true))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.i32Equals(2, registry.portfolios.length)
      assert.bytesEquals(ADDRESS_1, registry.portfolios[0])
      assert.bytesEquals(ADDRESS_2, registry.portfolios[1])
    })

    test('it should register Portfolio removals', () => {
      // Act
      handlePortfolioStatusSet(createPortfolioStatusSetEvent(ADDRESS_1, true))
      handlePortfolioStatusSet(createPortfolioStatusSetEvent(ADDRESS_2, true))
      handlePortfolioStatusSet(createPortfolioStatusSetEvent(ADDRESS_1, false))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.i32Equals(1, registry.portfolios.length)
      assert.bytesEquals(ADDRESS_2, registry.portfolios[0])
    })
  })

  describe('Authority and role management', () => {
    test('it should handle ownership changed', () => {
      // Act
      handleOwnershipChanged(createOwnershipChangedEvent(OWNER, ADDRESS_3))

      // Assert
      let registry = Registry.load('1')
      if (!registry) throw new Error('Registry not found in store')

      assert.bytesEquals(ADDRESS_3, registry.owner)
    })

    test('it should handle RoleCapability enabled', () => {
      // Arrange
      const role: i32 = 1
      const target = ADDRESS_1
      const functionSig: Bytes = Bytes.fromHexString('0x12345678')

      // Act
      handleRoleCapabilityUpdated(createRoleCapabilityUpdatedEvent(role, target, functionSig, true))

      // Assert
      const capabilityId = `${target.toHexString()}|${functionSig.toHexString()}`
      const capability = Capability.load(capabilityId)
      if (!capability) throw new Error('Capability not found in store')
      assert.bytesEquals(target, capability.target)
      assert.bytesEquals(functionSig, capability.signature)
      assert.booleanEquals(false, capability.isPublic)

      const roleId = role.toString()
      const roleCapabilityId = `${roleId}|${capabilityId}`
      const roleEntity = Role.load(roleId)
      if (!roleEntity) throw new Error('Role not found in store')
      assert.i32Equals(1, roleEntity.capabilities.length)
      assert.stringEquals(roleCapabilityId, roleEntity.capabilities[0])

      const roleCapability = RoleCapability.load(roleCapabilityId)
      if (!roleCapability) throw new Error('RoleCapability not found in store')

      assert.stringEquals(capabilityId, roleCapability.capability)
      assert.stringEquals(roleId, roleCapability.role)
    })

    test('it should handle RoleCapability disabled', () => {
      // Arrange
      const role: i32 = 1
      const target = ADDRESS_1
      const functionSig: Bytes = Bytes.fromHexString('0x12345678')

      // Act
      handleRoleCapabilityUpdated(createRoleCapabilityUpdatedEvent(role, target, functionSig, true))
      handleRoleCapabilityUpdated(createRoleCapabilityUpdatedEvent(role, target, functionSig, false))

      // Assert
      const capabilityId = `${target.toHexString()}|${functionSig.toHexString()}`
      const capability = Capability.load(capabilityId)
      if (!capability) throw new Error('Capability not found in store')
      assert.bytesEquals(target, capability.target)
      assert.bytesEquals(functionSig, capability.signature)
      assert.booleanEquals(false, capability.isPublic)

      const roleId = role.toString()
      const roleCapabilityId = `${roleId}|${capabilityId}`
      const roleEntity = Role.load(roleId)
      if (!roleEntity) throw new Error('Role not found in store')
      assert.i32Equals(0, roleEntity.capabilities.length)

      const roleCapability = RoleCapability.load(roleCapabilityId)
      assert.assertNull(roleCapability)
    })

    test('it should handle UserRole enabled', () => {
      // Arrange
      const role: i32 = 1
      const user = ADDRESS_1

      // Act
      handleUserRoleUpdated(createUserRoleUpdatedEvent(user, role, true))

      // Assert
      const roleId = role.toString()
      const roleEntity = Role.load(roleId)
      if (!roleEntity) throw new Error('Role not found in store')

      const roleUserId = `${user.toHexString()}|${roleId}`
      assert.i32Equals(1, roleEntity.users.length)
      assert.stringEquals(roleUserId, roleEntity.users[0])

      const roleUser = RoleUser.load(roleUserId)
      if (!roleUser) throw new Error('UserRole not found in store')
      assert.stringEquals(roleId, roleUser.role)
      assert.bytesEquals(user, roleUser.user)
    })

    test('it should handle UserRole disabled', () => {
      // Arrange
      const role: i32 = 1
      const user = ADDRESS_1

      // Act
      handleUserRoleUpdated(createUserRoleUpdatedEvent(user, role, true))
      handleUserRoleUpdated(createUserRoleUpdatedEvent(user, role, false))

      // Assert
      const roleId = role.toString()
      const roleEntity = Role.load(roleId)
      if (!roleEntity) throw new Error('Role not found in store')

      const authorityUser = AuthorityUser.load(user)
      if (!authorityUser) throw new Error('AuthorityUser not found in store')

      const roleUserId = `${user.toHexString()}|${roleId}`
      assert.i32Equals(0, roleEntity.users.length)

      const roleUser = RoleUser.load(roleUserId)
      assert.assertNull(roleUser)
    })

    test('it should handle public capability enabled', () => {
      // Arrange
      const target = ADDRESS_1
      const functionSig: Bytes = Bytes.fromHexString('0x12345678')

      // Act
      handlePublicCapabilityUpdated(createPublicCapabilityUpdatedEvent(target, functionSig, true))

      // Assert
      const capabilityId = `${target.toHexString()}|${functionSig.toHexString()}`
      const capability = Capability.load(capabilityId)
      if (!capability) throw new Error('Capability not found in store')
      assert.bytesEquals(target, capability.target)
      assert.bytesEquals(functionSig, capability.signature)
      assert.booleanEquals(true, capability.isPublic)
    })

    test('it should handle public capability disabled', () => {
      // Arrange
      const target = ADDRESS_1
      const functionSig: Bytes = Bytes.fromHexString('0x12345678')

      // Act
      handlePublicCapabilityUpdated(createPublicCapabilityUpdatedEvent(target, functionSig, true))
      handlePublicCapabilityUpdated(createPublicCapabilityUpdatedEvent(target, functionSig, false))

      // Assert
      const capabilityId = `${target.toHexString()}|${functionSig.toHexString()}`
      const capability = Capability.load(capabilityId)
      if (!capability) throw new Error('Capability not found in store')
      assert.bytesEquals(target, capability.target)
      assert.bytesEquals(functionSig, capability.signature)
      assert.booleanEquals(false, capability.isPublic)
    })
  })
})
