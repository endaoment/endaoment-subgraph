import { assert, describe, test, clearStore, beforeAll, afterAll, afterEach } from 'matchstick-as/assembly/index'
import { Address, BigInt, Entity } from '@graphprotocol/graph-ts'
import { EntityDeployed as EntityDeployedEvent } from '../generated/OrgFundFactory/OrgFundFactory'
import { handleEntityDeployed } from '../src/mappings/org-fund-factory'
import { createEntityDeployedEvent } from './org-fund-factory-utils'
import { OnChainNdaoEntityType } from '../src/utils/on-chain-entity-type'
import { NdaoEntity } from '../generated/schema'

describe('OrgFundFactory', () => {
  afterEach(() => {
    clearStore()
  })

  test('Should register Org Deployment', () => {
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
    assert.bigIntEquals(entityFromStore.recognizedUsdcBalance, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.investmentBalance, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcDonationsReceived, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcDonationsFee, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcGrantsReceived, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcGrantsInFee, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcContributionsReceived, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcContributionsFee, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcTransfersReceived, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcTransfersFee, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcReceived, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcReceivedFees, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcGrantedOut, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcGrantedOutFees, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcTransferredOut, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcTransferredOutFees, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcPaidOut, BigInt.fromI32(0))
    assert.bigIntEquals(entityFromStore.totalUsdcPaidOutFees, BigInt.fromI32(0))
  })
})
