---
title: What Is Gearbox?
sidebar_position: 1
---

## Introduction

Gearbox Protocol is a peer-to-peer system designed to provide users with a non-custodial collateralized line of credit which can be used to interact in a leveraged way with DAO-approved [(**ERC-20 Tokens**)](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) on the [**Ethereum**](https://ethereum.org/) blockchain. 
The protocol is implemented as a suite of upgradable smart contracts that together create a credit provider which is accessible and confined only to a wallet which we define as a "Credit Account". By design the system is secure, self-custodial, and functions without any trusted intermediaries who may selectively restrict access.


There are currently two versions of the Gearbox protocol.  
V1 is open source and licensed under the "Business Source License" which is viewable [**here**](https://github.com/Gearbox-protocol/gearbox-contracts/blob/master/LICENSE).  
V2 is open source and licensed under the "Business Source License" which is viewable [**here**](https://github.com/Gearbox-protocol/gearbox-contracts/blob/master/LICENSE). 

Each version of Gearbox, once deployed, will function in perpetuity, with 100% uptime, provided the continued existence of the Ethereum blockchain.

## How does the Gearbox protocol allow to take credit onchain in a safe way?

To understand how the Gearbox protocol allows its users to take leverage on their onchain operations in a secure way, it is helpful to first look at two subjects: how the protocol restricts funds to a specific non-custodial wallet, and how the DAO approves on which smartcontracts and ERC-20 tokens can be accessed. 

### Credit Accounts

At a very high level, a user of the platform takes ownership of a Credit Account, and funds it with a collateral denominated in a list of approved ERC-20 Tokens (Currently WETH, WTBC, USDC and DAI) is deposited. Based on a maximum leverage multiplier, credit originating from a LP is made available only within the Credit Account and cannot be transferred out of it.
This ensures that funds cannot be drained from the system, and that undercollateralized positions can be safely liquidated.

### DAO issues approval for contracts and tokens

To mitigate risk within the platform, the DAO votes on whitelisting of specific contracts and ERC-20 tokens that can be used by Gearbox Protocol.
The current token approvals can be read from the "Credit Filter" Smart contract, and the current list of approved Smart Contracts that can be interacted with can be read from the current list of Adapters that are active.

## Anyone can access Gearbox Protocol in a Permissionless way

Permissionless design means that the protocol’s services are entirely open for public use, with no ability to selectively restrict who can or cannot use them. Anyone can swap, provide liquidity, or create new markets at will. This is a departure from traditional financial services, which typically restrict access based on geography, wealth status, and age.