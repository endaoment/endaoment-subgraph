import { assert, describe, test, clearStore, afterEach } from 'matchstick-as'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './utils/org-fund-factory'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { NdaoEntity } from '../generated/schema'

function assertZeroedFinancials(entity: NdaoEntity): void {
  assert.bigIntEquals(BigInt.fromI32(0), entity.recognizedUsdcBalance)
  assert.bigIntEquals(BigInt.fromI32(0), entity.investmentBalance)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationsReceived)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcDonationFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantsReceived)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantInFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionsReceived)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcContributionFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransfersReceived)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferInFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcMigrated)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceived)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcReceivedFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOut)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcGrantedOutFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOut)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcTransferredOutFees)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOut)
  assert.bigIntEquals(BigInt.fromI32(0), entity.totalUsdcPaidOutFees)
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

    assert.stringEquals('Org', entityFromStore.entityType)
    assert.bytesEquals(entityManager, entityFromStore.entityManager)
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

    assert.stringEquals('Fund', entityFromStore.entityType)
    assert.bytesEquals(entityManager, entityFromStore.entityManager)
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

    assert.stringEquals('Unknown', entityFromStore.entityType)
    assert.bytesEquals(entityManager, entityFromStore.entityManager)
    assertZeroedFinancials(entityFromStore)
  })
})
