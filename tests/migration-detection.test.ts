import { afterEach, describe, clearStore, test } from 'matchstick-as'
describe('Migration Detection Tests', () => {
  afterEach(() => {
    clearStore()
  })

  // 100 USD - TOTAL 100 USD
  // 100 USD - TOTAL 200 USD
  // 150 USD - TOTAL 350 USD (New block)
  test('it should correctly index multiple donations without V1 Assets', () => {
    // Arrange
    // Act
    // Assert
  })
})
