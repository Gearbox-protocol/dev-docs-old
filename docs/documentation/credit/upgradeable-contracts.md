# Upgradeable contracts

CreditFacade contains a list of contracts that have practices potentially detrimental to security, called `upgradeableContracts`. Some of the examples of practices that would be grounds to inclusion are:
- Ability to upgrade the contract implementation
- Ability to make arbitrary calls (even restricted to admins)
- Ability to `transfer` / `transferFrom` arbitrary tokens

Some of Gearbox's features are restricted to contracts that are not in the list. 

The only current example is `CreditFacade.approve()`, which allows a user to set arbitrary allowance from a Credit Account to a contract that is recognized in the system. It is dangerous to allow this function for upgradeable contracts, as a compromised contract's implementation can be changed to allow the attacker calling `transferFrom` for arbitrary tokens, which would allow them to drain approved funds from Gearbox.

We anticipate that new restricted functions and features would be added as Gearbox grows.