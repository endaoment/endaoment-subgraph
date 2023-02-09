## Setup
Follow [here](https://thegraph.com/docs/en/developing/creating-a-subgraph/)

## Methods that change balance in the contracts
- `_donateWithFeeMultiplier`
  - **(+)** Increase balance
  - Emits `EntityDonationReceived`
- `_swapAndDonateWithFeeMultiplier`
  - **(+)** Increase balance
  - Emits `EntityDonationReceived`
- `_transferWithFeeMultiplier`
  - **(-)** Decrease balance
  - Emits `EntityValueTransferred`
- `portfolioDeposit`
  - **(-)** Decrease balance
  - Emits `EntityDeposit`
- `portfolioRedeem`
  - **(+)** Increase balance
  - Emits `EntityRedeem`
- `reconcileBalance`
  - **(+)** Increase balance
    - Emits `EntityBalanceReconciled`
  - **(-)** Decrease balance
    - Emits `EntityBalanceCorrected`
- `swapAndReconcileBalance`
  - **(+)** Increase balance
  - Emits `EntityBalanceReconciled`
- `_payoutWithFeeMultiplier`
  - **(-)** Decrease balance
  - Emits `EntityValuePaidOut`
## Todo:

### Org Indexed Data
- Org Address
- Org EIN
- Org Manager
- Total Usdc Donated (optional)
- Total Usdc Granted (optional)
- Total Usdc paid out (optional)
- Current Usdc Balance (optional)

## Fund Indexed Data

- Fund Address
- Fund manager
- Total Usdc Donated (optional)
- Total Usdc granted (optional)
- Current Usdc Balance (optional)

## Permission List  (Optional)
- Who is privileged? (optional)
- Who has permission to call what? (optional)

## Donations (Optional)
- Track individual & immutable donations and correlate them with entities

## Donors (Optional)
- Track total donated by someone
- Track individual donations made 
- Track individual 