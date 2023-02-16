import { assert, describe, test, clearStore, afterEach, beforeAll } from 'matchstick-as'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { NdaoEntity, Registry } from '../generated/schema'
import { mockOrgId } from './utils/ndao-entity'
import {
  handleFactoryApprovalSet,
  handlePortfolioStatusSet,
  handleSwapWrapperStatusSet,
} from '../src/mappings/registry'
import {
  createFactoryApprovalSetEvent,
  createPortfolioStatusSetEvent,
  createSwapWrapperStatusSetEvent,
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
