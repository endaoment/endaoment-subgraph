import { assert, describe, test, clearStore, afterEach } from 'matchstick-as'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './org-fund-factory-utils'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { NdaoEntity } from '../generated/schema'

function assertZeroedFinancials(entity: NdaoEntity): void {
  assert.bigIntEquals(entity.recognizedUsdcBalance, BigInt.fromI32(0))
  assert.bigIntEquals(entity.investmentBalance, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcDonationsReceived, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcDonationsFee, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcGrantsReceived, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcGrantsInFee, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcContributionsReceived, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcContributionsFee, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcTransfersReceived, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcTransfersFee, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcReceived, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcReceivedFees, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcGrantedOut, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcGrantedOutFees, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcTransferredOut, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcTransferredOutFees, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcPaidOut, BigInt.fromI32(0))
  assert.bigIntEquals(entity.totalUsdcPaidOutFees, BigInt.fromI32(0))
}

describe('OrgFundFactory', () => {
  afterEach(() => {
    clearStore()
  })

  test('it should register Org deployment', () => {
    // Arrange
    let entityAddress = Address.fromString('0x0000000000000000000000000000000000000001')
    let entityType = OnChainNdaoEntityType.Org
    let entityManager = Address.fromString('0x0000000000000000000000000000000000000002')
    let newEntityDeployedEvent = createEntityDeployedEvent(entityAddress, entityType, entityManager)

    // Act
    handleEntityDeployed(newEntityDeployedEvent)

    // Assert
    let entityFromStore = NdaoEntity.load(entityAddress)
    if (!entityFromStore) throw new Error('Entity not found in store')

    assert.stringEquals(entityFromStore.entityType, 'Org')
    assert.bytesEquals(entityFromStore.entityManager, entityManager)
    assertZeroedFinancials(entityFromStore)
  })

  test('it should register Fund deployment', () => {
    // Arrange
    let entityAddress = Address.fromString('0x0000000000000000000000000000000000000001')
    let entityType = OnChainNdaoEntityType.Fund
    let entityManager = Address.fromString('0x0000000000000000000000000000000000000002')
    let newEntityDeployedEvent = createEntityDeployedEvent(entityAddress, entityType, entityManager)

    // Act
    handleEntityDeployed(newEntityDeployedEvent)

    // Assert
    let entityFromStore = NdaoEntity.load(entityAddress)
    if (!entityFromStore) throw new Error('Entity not found in store')

    assert.stringEquals(entityFromStore.entityType, 'Fund')
    assert.bytesEquals(entityFromStore.entityManager, entityManager)
    assertZeroedFinancials(entityFromStore)
  })

  test('it should register new entity type deployment', () => {
    // Arrange
    let entityAddress = Address.fromString('0x0000000000000000000000000000000000000001')
    let entityType = 3
    let entityManager = Address.fromString('0x0000000000000000000000000000000000000002')
    let newEntityDeployedEvent = createEntityDeployedEvent(entityAddress, entityType, entityManager)

    // Act
    handleEntityDeployed(newEntityDeployedEvent)

    // Assert
    let entityFromStore = NdaoEntity.load(entityAddress)
    if (!entityFromStore) throw new Error('Entity not found in store')

    assert.stringEquals(entityFromStore.entityType, 'Unknown')
    assert.bytesEquals(entityFromStore.entityManager, entityManager)
    assertZeroedFinancials(entityFromStore)
  })
})
