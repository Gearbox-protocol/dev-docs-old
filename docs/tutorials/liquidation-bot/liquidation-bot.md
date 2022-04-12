# Liquidation Bot

As you know, Gearbox is a leverage protocol and leverage protocol need people to help doing the liquidation. Thus, we build a liquidation bot for you, you can use it to do the liquidation. You also can do your own modification on [it](https://github.com/Gearbox-protocol/liquidation-bot).  

This chapter is the documentations of liquidation bot, the liquidation bot is divided into two parts of code, one is the smart contract code on the chain, which is responsible for encapsulating the transactions of the whole liquidation process into a function inside the contract. The other part is the local monitoring system and the system for issuing liquidation transactions. The monitoring system will monitor the price of the token, the health factor of the credit account, generate transactions and send them to the blockchain when a credit account is found to be liquidated.

In the whole chapter, we will talk how to use the liquidation bot and also explain the code of the liquidation bot, including

* Run Liquidation Bot
* Bot Smart Contract
* Credit Service
* Price Oracle
* Token Service
