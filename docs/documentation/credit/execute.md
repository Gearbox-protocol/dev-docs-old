# Executing transactions

User can consider credit account as your additional account, because all opeartions are executed on behalf of it.

![Opening credit account](</images/credit/execute.jpg>)

To interact with 3rd party protocol, each it's contract should be connected with CreditManager via special 
contract called [Adapter](/docs/documentation/integrations/intro). This contract has the same API as original contract, so you should "prepare" your calldata and send it to adapter instead original contract.

### When transaction could be reverted



