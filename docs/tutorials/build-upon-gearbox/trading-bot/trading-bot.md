# Trading Bot

In this section, let's build some composable trading strategies on Gearbox Protocol. First of all, we need to figure out the `CreditAccount` we want to trade can be used in what adapters, One way to find out what adapters are in the whitelist is through the `ContractAllowed` event recorded by the `CreditFilter` of your `CreditAccount`. The other way is finding the corresponding adapter contract address according to the type of the `CreditAccount` you are using in [deployed contacts](../../deployed-contracts). We will assume that you have knew the adapter address you want to use and we mainly introduce two strategies in the subsections:
    * Composable BTC short
    * Time Arbitrage 
