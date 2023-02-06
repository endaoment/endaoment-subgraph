import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { EntityDeployed } from "../generated/schema"
import { EntityDeployed as EntityDeployedEvent } from "../generated/OrgFundFactory/OrgFundFactory"
import { handleEntityDeployed } from "../src/org-fund-factory"
import { createEntityDeployedEvent } from "./org-fund-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let entity = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let entityType = 123
    let entityManager = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newEntityDeployedEvent = createEntityDeployedEvent(
      entity,
      entityType,
      entityManager
    )
    handleEntityDeployed(newEntityDeployedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("EntityDeployed created and stored", () => {
    assert.entityCount("EntityDeployed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "EntityDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entity",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "EntityDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entityType",
      "123"
    )
    assert.fieldEquals(
      "EntityDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entityManager",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
