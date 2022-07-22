# Expirable Credit Facade

## Motivation

Down the line, in addition to standard variable-rate loans, Gearbox will support fixed-term loans, sourcing liquidity from projects such as Yield Protocol or Element Finance.

Fixed term loans in DeFi typically involve zero-coupon bond-like tokens that have a certain maturity date and yield paid out at maturity (this is usually represented by a discount that decreases the closer to maturity the token is).

In order to support this mode of liquidity provision, the logic for tracking expirations was added to the CreditFacade, and the ability to liquidate expired Credit Accounts was added to the Credit Manager.

## Expiration logic

There is a single expiration date for each CreditFacade that affects all Credit Accounts opened through it. This expiration date would typically be set shortly before the underlying yield token maturity, so that Gearbox is able to collect any outstanding debt and repay its loan to the underwriter.

It is not possible to open new Credit Accounts past the expiration date, and all accounts that remain open after the expiration date are eligible to "liquidation by expiry". Liquidation by expiry has lower liquidation premiums compared to normal liquidations (which can be afforded, since it is less urgent than liquidating an unhealthy account that risks to accrue bad debt).

After expiration, the expiration date in the CreditFacade can be moved forward, in order to reflect a new maturity date for loans, which allows opening accounts in the CreditFacade once again.