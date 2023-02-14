## Setup
Follow [here](https://thegraph.com/docs/en/developing/creating-a-subgraph/)

## Methods that change balance in the contracts
- `_donateWithFeeMultiplier` 
  - **(+)** Increase balance
  - Emits `EntityDonationReceived` [OK]
- `_swapAndDonateWithFeeMultiplier` 
  - **(+)** Increase balance
  - Emits `EntityDonationReceived` [OK]
- `_transferWithFeeMultiplier` 
  - **(-)** Decrease balance
  - Emits `EntityValueTransferred` [OK]
- `receiveTransfer`
  - **(+)** Increase balance
  - **Does not emit events** [OK]
- `portfolioDeposit`
  - **(-)** Decrease balance
  - Emits `EntityDeposit` [OK]
- `portfolioRedeem`
  - **(+)** Increase balance
  - Emits `EntityRedeem` [OK]
- `reconcileBalance` 
  - **(+)** Increase balance
    - Emits `EntityBalanceReconciled` [OK]
  - **(-)** Decrease balance
    - Emits `EntityBalanceCorrected` [OK]
- `swapAndReconcileBalance`
  - **(+)** Increase balance
  - Emits `EntityBalanceReconciled` [OK]
- `_payoutWithFeeMultiplier`
  - **(-)** Decrease balance
  - Emits `EntityValuePaidOut` [OK]
## Todo:

### Org Indexed Data
- Org Address [OK]
- Org EIN [OK]
- Org Manager [OK]
- Total Usdc Donated [OK]
- Total Usdc Granted [OK]
- Total Usdc paid out [OK]
- Current Usdc Balance [OK]
- Unreconciled ETH (IMPLEMENT)

## Fund Indexed Data

- Fund Address [OK]
- Fund manager [OK]
- Total Usdc Donated [OK]
- Total Usdc granted [OK]
- Current Usdc Balance [OK]
- Unreconciled ETH (IMPLEMENT)

## Permission List (IMPLEMENT)
- Who is privileged? (optional)
- Who has permission to call what? (optional)

## Donations (Optional)
- Track individual & immutable donations and correlate them with entities

## Donors (Optional)
- Track total donated by someone
- Track individual donations made 
- Track individual 