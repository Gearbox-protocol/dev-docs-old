# Universal adapter

A universal adapter is an adapter that can serve several target contracts at once. It has some limitations (such as the API not being consistent with the target contract), but would allow to connect new protocols much faster than with fully fledged adapters.

The core intuition behind the unversal adapter is that, for a lot of underlying protocols, the tokens involved in a particular operation can be directly associated with the target contract and a function signature. For example, a deposit call to the yvDAI vault will always use DAI as an input token and yvDAI as an output.

As such, a universal adapter will store structures encoding a target contract, a function signature, and relevant tokens, and allow performing calls based on those structures.

## Revocations

Currently, the primary logic of the universal adapter is in the research phase and is not yet present in adapter code. Instead, the universal adapter is used for allowance revocations.

Since Credit Accounts are reused among borrowers, even a newly-opened account may have non-zero allowances to some contracts. Users with high-value portfolios may want to ensure that their accounts do not have any unforseen allowances after opening.

Allowances can be revoked using `UniversalAdapter` functions:

```=solidity
function revokeAdapterAllowances(
    RevocationPair[] calldata revocations
) external;
```

| Parameter      | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------|
| revocations | The pairs of target contract (spender) and token to revoke allowances for.                                                         |

```=solidity
function revokeAdapterAllowances(
    RevocationPair[] calldata revocations,
    address expectedCreditAccount
) external;
```

| Parameter      | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------|
| revocations | The pairs of target contract (spender) and token to revoke allowances for.                                                         |
| expectedCreditAccount | The credit account for msg.sender must match this address, and the function will revert otherwise. Since the `revocations` array is constructed for each individual Credit Account based on allowances at opening, this allows to ensure that revocations are performed for a correct account.                                                         |
