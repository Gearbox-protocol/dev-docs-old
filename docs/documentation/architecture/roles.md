import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Role model

## Roles
ACL contract keeps global roles for whole Gearbox Protocol. There are 3 basic roles in the system:

| Role                | Responsibility                                                           | 
| ------------------- | ------------------------------------------------------------------------ |
| Configurator        | Role which has the most powerful roles for configuring system parameters |
| PausableAdmin       | Role can `pause` contracts                                               |
| UnPausableAdmin     |  Role can `unpause` contracts                                            |

## Configurator role

Configurator is `onwer` of `ACL` contract. This code snippet shows how to get the current adddress:

```solidity   
 address configurator = ACL(addressProvider.getACL()).owner();
```

In current deployment, Configurator is managed by Technical Multisig, in the future, Gearbox will use
Compound Bravo Governance.

### How to test your contracts
In many cases, developer needs to change system parameters:


<Tabs>
<TabItem value="solidity" label="Forge (solidity)">

```solidity   
 address configurator = ACL(addressProvider.getACL()).owner();
 evm.prank(configurator);
```

</TabItem>
<TabItem value="typescript" label="HardHat (typescript)">

```typescript

```

</TabItem>


</Tabs>

