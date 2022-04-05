# Python Analytical Tool

For some developers who prefer to use Python, we make an additional section here to show how to use jupyter notebook to get `CreditAccount` and make some analysis. So first of all, we need to install `web3` python package and `multicall` package. Yes, we will use `multicall` in the example below. If you go through the whole workflow below, you will get something like [GearboxCreditAccounts.ipyn](https://colab.research.google.com/drive/1YORBt-1ZzClkFYJGOjkAHD9Xx3_nf9eT?usp=sharing).


In[1]:
```
!pip uninstall jsonschema
!pip3 install --force-reinstall jsonschema==3.2.0
!pip install web3
!pip install multicall
```
Import some required packages and connect to ethereum rpc.

In[2]:
```python
from IPython.core.display import display, HTML
display(HTML("<style>.container { width:100% !important; }</style>"))

import time
from datetime import datetime
import requests
import json
import pandas as pd
from web3 import Web3
from web3.exceptions import (ContractLogicError, InvalidEventABI, LogTopicError, MismatchedABI)
from web3._utils.events import get_event_data
from eth_utils import (encode_hex, event_abi_to_log_topic)
from web3.datastructures import AttributeDict
from multicall import Call, Multicall


Etherscan_APIKEY   = None #optional, but recommended
GearboxAddressProvider = '0xcF64698AFF7E5f27A11dff868AF228653ba53be0'

# The dafault RPC from ethersjs, change it if it doesn't work: https://infura.io/docs
RPC_Endpoint = 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213'

w3_eth = Web3(Web3.HTTPProvider(RPC_Endpoint, request_kwargs={'timeout': 20}))
print ('Ethereum connected:', w3_eth.isConnected())

```
```
Ethereum connected: True

```

Define three functions including `parse_abi`, `get_logs` and `pull_abi_etherscan`. We can use `pull_abi_etherscan` to pull the abi json by contract address through etherscan and then use `parse_abi` to parse the abi json to a dataframe for further uses. `getlogs` is used for get event logs of a specified contract.

In[3]:
```python
def parse_abi(abi_dict, abi_type = None):
    recs = []
    for contract_type in abi_dict.keys():
        for rec in [x for x in abi_dict[contract_type] if not abi_type or x['type'] == abi_type]:
            topic = None
            if rec['type'] == 'event':
                topic = encode_hex(event_abi_to_log_topic(rec))
            name = None
            if 'name' in rec:
                name = rec['name']
                
            recs.append({'contract_type': contract_type,
                           'name'        : name,
                           'type'        : rec['type'],
                           'abi'         : rec,
                           'topic'       : topic,
                           })
    
    df = pd.DataFrame(recs)
    return df

def get_logs(w3, contract_address, topics=None, from_block=0, to_block='latest'):
    logs = w3.eth.get_logs({"address": contract_address
                           ,"topics":topics 
                           ,"fromBlock": from_block 
                           ,"toBlock": to_block
                           })

    all_events = []
    for l in logs:
        try:
            evt_topic0 = l['topics'][0].hex()
            evt_abi = df_abi[df_abi['topic']== evt_topic0]['abi'].values[0] 
            evt = get_event_data(w3.codec, evt_abi, l)
        except MismatchedABI: #if for some reason there are other events 
            pass
        all_events.append(evt)
    df = pd.DataFrame(all_events)
    return df

def pull_abi_etherscan(contract_address, apikey = Etherscan_APIKEY):
    url = 'https://api.etherscan.io/api?module=contract&action=getabi'
    params = {'address':contract_address,'apikey' : apikey}
    
    if not apikey:
        time.sleep(5) # rate-limit when apikey is empty
        
    response = requests.get(url, params=params)
    response_json = json.loads(response.text)
    
    if response_json['status']  == '1':
        return json.loads(response_json['result'])
    else:
        raise Exception(response_json['result'])
```

After defined these three functions, we use them to get some data of Gearbox Contract including address of `AccountFactory`, `masterCreditAccount`, `DataCompressor`, `ContractsRegister` and `CreditManager`s. And then get details of `CreditManager`s and `AllowedToken`s.

In[4]:
```python
print(datetime.utcnow(),'start')
AddressProvider = Web3.toChecksumAddress(GearboxAddressProvider)
AddressProvider_abi = pull_abi_etherscan(AddressProvider)

AccountFactory = w3_eth.eth.contract(address=AddressProvider, abi=AddressProvider_abi).functions.getAccountFactory().call()
print('AccountFactory:', AccountFactory)
AccountFactory_abi = pull_abi_etherscan(AccountFactory)
countCreditAccounts = w3_eth.eth.contract(address=AccountFactory, abi=AccountFactory_abi).functions.countCreditAccounts().call()
countCreditAccountsInStock = w3_eth.eth.contract(address=AccountFactory, abi=AccountFactory_abi).functions.countCreditAccountsInStock().call()
print('countCreditAccounts:', countCreditAccounts)
print('countCreditAccountsInStock:', countCreditAccountsInStock)
masterCreditAccount = w3_eth.eth.contract(address=AccountFactory, abi=AccountFactory_abi).functions.masterCreditAccount().call()
print('masterCreditAccount:', masterCreditAccount)
CreditAccount_abi = pull_abi_etherscan(masterCreditAccount)

DataCompressor = w3_eth.eth.contract(address=AddressProvider, abi=AddressProvider_abi).functions.getDataCompressor().call()
print('DataCompressor:', DataCompressor)
DataCompressor_abi = pull_abi_etherscan(DataCompressor)

ContractsRegister = w3_eth.eth.contract(address=AddressProvider, abi=AddressProvider_abi).functions.getContractsRegister().call()
print('ContractsRegister:', ContractsRegister)
ContractsRegister_abi = pull_abi_etherscan(ContractsRegister)

CreditManagers = w3_eth.eth.contract(address=ContractsRegister, abi=ContractsRegister_abi).functions.getCreditManagers().call()
print('CreditManagers:', CreditManagers)

cm_dict = {AccountFactory: {'symbol': None, 'decimals': None}}
allowedTokens = {}
for i, CreditManager in enumerate(CreditManagers):
    print(datetime.utcnow(),'CreditManager ', i+1, 'of', len(CreditManagers))
    if i==0:
        CreditManager_abi = pull_abi_etherscan(CreditManager)

    Token = w3_eth.eth.contract(address=CreditManager, abi=CreditManager_abi).functions.underlyingToken().call()  
    
    if i==0:
        Token_abi = pull_abi_etherscan(Token)   
    
    CreditFilter = w3_eth.eth.contract(address=CreditManager, abi=CreditManager_abi).functions.creditFilter().call()
    
    if i==0:
        CreditFilter_abi = pull_abi_etherscan(CreditFilter)
        
    allowedTokensCount = w3_eth.eth.contract(address=CreditFilter, abi=CreditFilter_abi).functions.allowedTokensCount().call()
    priceOracle        = w3_eth.eth.contract(address=CreditFilter, abi=CreditFilter_abi).functions.priceOracle().call()
    wethAddress        = w3_eth.eth.contract(address=CreditFilter, abi=CreditFilter_abi).functions.wethAddress().call()
    
    if i==0:
        priceOracle_abi = pull_abi_etherscan(priceOracle)
    
    cm_dict[CreditManager] = {'symbol': w3_eth.eth.contract(address=Token, abi=Token_abi).functions.symbol().call(),
                              'decimals': w3_eth.eth.contract(address=Token, abi=Token_abi).functions.decimals().call(),
                              'CreditFilter': CreditFilter,
                              'priceOracle' : priceOracle,
                              'allowedTokensCount': allowedTokensCount,
                              'allowedTokens':{},
                             }
    for token_id in range(allowedTokensCount):
        allowed_token = w3_eth.eth.contract(address=CreditFilter, abi=CreditFilter_abi).functions.allowedTokens(token_id).call()
        allowed_token_symbol = w3_eth.eth.contract(address=allowed_token, abi=Token_abi).functions.symbol().call()
        allowed_token_decimals = w3_eth.eth.contract(address=allowed_token, abi=Token_abi).functions.decimals().call()
        
        try:
            allowed_token_weth_priceOracle = w3_eth.eth.contract(address=priceOracle, abi=priceOracle_abi).functions.getLastPrice(allowed_token, wethAddress).call()
        except ContractLogicError:
            allowed_token_weth_priceOracle = None
            print(allowed_token_symbol+'-WETH getLastPrice error')
        
        try:    
            allowed_token_underlying_priceOracle = w3_eth.eth.contract(address=priceOracle, abi=priceOracle_abi).functions.getLastPrice(allowed_token, Token).call()
        except ContractLogicError:
            allowed_token_underlying_priceOracle = None
            print(allowed_token_symbol+'-WETH getLastPrice error')

        Token_dict={'symbol'          : allowed_token_symbol, 
                    'decimals'        : allowed_token_decimals,
                    'Price_WETH'      : allowed_token_weth_priceOracle,
                    'Price_'+cm_dict[CreditManager]['symbol']: allowed_token_underlying_priceOracle,
                    }
        if allowed_token in allowedTokens:
            allowedTokens[allowed_token].update(Token_dict)
        else:
            allowedTokens[allowed_token] = Token_dict
    
df_abi = parse_abi({'AddressProvider':AddressProvider_abi, 
                    'AccountFactory': AccountFactory_abi, 
                    'DataCompressor': DataCompressor_abi,
                    'CreditManager': CreditManager_abi,
                    'CreditFilter': CreditFilter_abi,
                    'CreditAccount': CreditAccount_abi,
                   })

display(cm_dict) 
display(allowedTokens)
```

We define some functions to use `multicall` to get `CreditAccount`s. To prevent timeout, we need to batch the chunks into chunks.

In[5]:
```python
def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def combine_description(description):
    text_description = ''
    for x in description:
        if x['type']=='tuple': 
            text_description += '(' + combine_description(x['components'])+')'+','
        elif x['type']=='tuple[]': 
            text_description += '(' + combine_description(x['components']) + ')[]' +','
            
        else:
            text_description += x['internalType']+',' 
    return text_description[0:-1]      

def get_function_signature(function_name, df_abi, inputs=None, outputs=None):
    if not inputs:
        inputs = df_abi[df_abi['name']==function_name]['abi'].values[0]['inputs']
    if not outputs:
        outputs= df_abi[df_abi['name']==function_name]['abi'].values[0]['outputs']
    
    return function_name +'(' + combine_description(inputs) + ')' + '(' + combine_description(outputs) +')' 

def get_data_multicall(df, function_name, df_abi, contract_address = None):
    
    function_signature = get_function_signature(function_name, df_abi)
    #print(function_signature)
    
    if function_name == 'creditAccounts':
        multi_result = Multicall([
                    Call(contract_address, [function_signature, x], [[x, Web3.toChecksumAddress]]) for x in df['id']
                    ]
                    ,_w3 = w3_eth)
    elif function_name == 'creditManager':
        multi_result = Multicall([
                        Call(y, [function_signature], [[x, Web3.toChecksumAddress]]) for x,y in zip(df['id'],df['CA'])
                        ]
                        ,_w3 = w3_eth) 
    elif function_name == 'borrowedAmount':
        multi_result = Multicall([
                        Call(y, [function_signature], [[x, None]]) for x,y in zip(df['id'],df['CA'])
                        ]
                        ,_w3 = w3_eth) 
    elif function_name == 'since':
        multi_result = Multicall([
                        Call(y, [function_signature], [[x, None]]) for x,y in zip(df['id'],df['CA'])
                        ]
                        ,_w3 = w3_eth)
    elif function_name == 'getCreditAccountDataExtended':
        #print(function_signature)
        multi_result = Multicall([
                        Call(contract_address, [function_signature, y, z], [[x, None]]) for x,y,z in zip(df['id'],df['CM'],df['Borrower'])
                        ]
                        ,_w3 = w3_eth)    
    try:
        multi_result = multi_result()
    except (requests.exceptions.HTTPError):
        time.sleep(3)
        multi_result = multi_result()
        
    d_multi_result = AttributeDict.recursive(multi_result)
    return d_multi_result

```

Now we can start to get the `CreditAccount`s by multicall. We get 1000 `CreditAccount`s once.
  * Get `CreditAccount`s' addresses from `AccountFactory`.
  * For each `CreditAccount`, get its `CreditManager`.
  * For each `CreditAccount`, get its `borrowedAmount`.
  * For each `CreditAccount`, get the block number this account was minted.

In[6]:
```python
df = pd.DataFrame()
df['id'] = range(countCreditAccounts)
for ids in list(chunks(list(df['id']), 1000)): #chunk size for multicall = 1000 (reduce in case of issues)
    id_range = list(df['id'].isin(ids))
    d_ca = get_data_multicall(df.loc[id_range], 'creditAccounts', df_abi, AccountFactory)
    df.loc[id_range,'CA'] = df.loc[id_range].apply(lambda x: d_ca[x['id']], axis=1)

    d_cm = get_data_multicall(df.loc[id_range], 'creditManager', df_abi)
    df.loc[id_range,'CM'] = df.loc[id_range].apply(lambda x: d_cm[x['id']], axis=1)
    
    d_amount = get_data_multicall(df.loc[id_range], 'borrowedAmount', df_abi)
    df.loc[id_range,'borrowedAmount'] = df.loc[id_range].apply(lambda x: d_amount[x['id']] if d_amount[x['id']] > 1 else 0 , axis=1)
    
    d_since = get_data_multicall(df.loc[id_range], 'since', df_abi)
    df.loc[id_range,'Since'] = df.loc[id_range].apply(lambda x: d_since[x['id']], axis=1)

df['Since'] = df['Since'].astype(int)
df['Decimals'] = df.apply(lambda x: cm_dict[x['CM']]['decimals'], axis=1)
df['Symbol'] = df.apply(lambda x: cm_dict[x['CM']]['symbol'] , axis=1)
df
```

We can also get `CreditAccount`s through event logs.

In[7]:
```python
#Open, Close, Repay, Liquidate
OpenCreditAccount_topic      =  df_abi[(df_abi['name']=='OpenCreditAccount') &(df_abi['type']=='event')]['topic'].values[0]
AddCollateral_topic          =  df_abi[(df_abi['name']=='AddCollateral')&(df_abi['type']=='event')]['topic'].values[0]
CloseCreditAccount_topic     =  df_abi[(df_abi['name']=='CloseCreditAccount')&(df_abi['type']=='event')]['topic'].values[0]
RepayCreditAccount_topic     =  df_abi[(df_abi['name']=='RepayCreditAccount')&(df_abi['type']=='event')]['topic'].values[0]
LiquidateCreditAccount_topic =  df_abi[(df_abi['name']=='LiquidateCreditAccount')&(df_abi['type']=='event')]['topic'].values[0]

print('OpenCreditAccount_topic:', OpenCreditAccount_topic)
print('CloseCreditAccount_topic:', CloseCreditAccount_topic)
print('RepayCreditAccount_topic:', RepayCreditAccount_topic)
print('LiquidateCreditAccount_topic:', LiquidateCreditAccount_topic)

logs = pd.DataFrame()
for CM in CreditManagers:
    CM_logs = get_logs(w3_eth, CM, [[OpenCreditAccount_topic,
                                      AddCollateral_topic,
                                      CloseCreditAccount_topic, 
                                      RepayCreditAccount_topic, 
                                      LiquidateCreditAccount_topic]],
                        df.loc[df['CM']==CM]['Since'].min(),
                    'latest')
    logs = logs.append(CM_logs, ignore_index = True) 

i=0
for row in df.loc[df['CM'].isin(CreditManagers)].itertuples():
    i+=1
    open_events       = logs[(logs['address']==row.CM) & (logs['blockNumber']>=row.Since) & (logs['event']=='OpenCreditAccount')]['args'].values 
    collateral_events = logs[(logs['address']==row.CM) & (logs['blockNumber']>=row.Since) & (logs['event']=='AddCollateral')]['args'].values 
    close_events      = logs[(logs['address']==row.CM) & (logs['blockNumber']>=row.Since) & (logs['event']=='CloseCreditAccount')]['args'].values 
    repay_events      = logs[(logs['address']==row.CM) & (logs['blockNumber']>=row.Since) & (logs['event']=='RepayCreditAccount')]['args'].values
    liquidate_event   = logs[(logs['address']==row.CM) & (logs['blockNumber']>=row.Since) & (logs['event']=='LiquidateCreditAccount')]['args'].values
    
    CA_open_event = [x for x in open_events if x['creditAccount']== row.CA] # Open
    if len(CA_open_event) > 0:
        Borrower = CA_open_event[0]['onBehalfOf']
        df.loc[df['id']==row.id, 'Borrower'] = Borrower
        
        Collateral = sum([x['amount'] for x in CA_open_event])
        CA_collateral_event = [x for x in collateral_events if x['onBehalfOf']== Borrower] # Open
        if len(CA_collateral_event) > 0:
            Collateral = Collateral + sum([x['value'] for x in CA_collateral_event])
        df.loc[df['id']==row.id, 'Collateral'] = Collateral
                           
        CA_close_event = [x for x in close_events if x['to']== Borrower] # Close
        if len(CA_close_event) > 0:
            df.loc[df['id']==row.id, ['Borrower', 'borrowedAmount', 'Collateral']] = [None, 0, 0]

        CA_repay_event = [x for x in repay_events if x['to']== Borrower] # Repay
        if len(CA_repay_event) > 0:
            df.loc[df['id']==row.id, ['Borrower', 'borrowedAmount', 'Collateral']] = [None, 0, 0]

        CA_liquidate_event = [x for x in liquidate_event if x['owner']== Borrower] # Liquidate
        if len(CA_liquidate_event) > 0:
            df.loc[df['id']==row.id, ['Borrower', 'borrowedAmount', 'Collateral']] = [None, 0, 0]
            
    if i % 50 == 0:
        print (datetime.utcnow(), ':', i)

print(datetime.utcnow(), i, 'end')
display(df)    

```

We can also get `CreditAccount`s' extended data through `DataCompressor`. **Note that do not use for data from data compressor for state-changing functions**

In[8]:
```python
def getCreditAccountDataExtended(id, cm, borrower):
    try:
        return w3_eth.eth.contract(address=DataCompressor, abi=DataCompressor_abi).functions.getCreditAccountDataExtended(cm, borrower).call()
    except:
        print('Error: id=',id,'CM=',cm,'Borrower=',borrower)


data_cols = [x['name'] for x in df_abi[df_abi['name']=='getCreditAccountDataExtended']['abi'].values[0]['outputs'][0]['components']]

batchtime = datetime.utcnow()
df['batchtime'] = batchtime

def get_token_balance(df_row, data_cols, d_data):
    ret = 0
    try:
        if d_data[df_row['id']]: 
            ret = {allowedTokens[Web3.toChecksumAddress(d[0])]['symbol']:d[1] for d in list({y:z for y, z in zip(data_cols, d_data[df_row['id']])}['balances'])}[token]
    except KeyError:
        pass
    return ret

for ids in list(chunks(list(df[pd.notna(df['Borrower'])].loc[:,'id']), 1000)): #chunk size for multicall = 1000 (reduce in case of issues)
    id_range = list(df['id'].isin(ids))
    try:
        d_data = get_data_multicall(df.loc[id_range], 'getCreditAccountDataExtended', df_abi, DataCompressor)
    except ContractLogicError:
        print('getCreditAccountDataExtended: Multicall error, calling it one by one')
        d_data = {x:getCreditAccountDataExtended(x,y,z) for x,y,z in zip(df.loc[id_range]['id'],df.loc[id_range]['CM'],df.loc[id_range]['Borrower'])}
        d_data = AttributeDict.recursive(d_data)
    for data in data_cols:
        if data not in ['balances', 'inUse', 'borrower', 'addr', 'borrower', 'creditManager', 'since']: #duplicate columns
            df.loc[id_range, data] = df.loc[id_range].apply(lambda x: {y:z for y, z in zip(data_cols, d_data[x['id']])}[data] if d_data[x['id']] else None
                                                            , axis=1)
        
    tokens_to_frame = [allowedTokens[x]['symbol'] for x in allowedTokens] 
    for token in tokens_to_frame:
        df.loc[id_range, 'Balance_'+token] = df.loc[id_range].apply(lambda x: get_token_balance(x, data_cols, d_data)
                                                        , axis=1)
        
df 
```

The `CreditAccount`s we got above including inactive account, we can get active `CreditAccount`s by filtering out `NAN`.

In[9]:
```python
df[pd.notna(df['Borrower'])] # active CAs
```

Get data types of columns in `CreditAccount`s list.

In[10]:
```python
#For compatability with BQ data types 
numeric_cols = [x for x in df.columns if x not in ['CA', 'CM' ,'Symbol', 'Borrower', 'batchtime', 
                                                      'underlyingToken', 'canBeClosed']]
df[numeric_cols] = df[numeric_cols].astype('float64')
df['canBeClosed'] =  df['canBeClosed'].astype('bool')

df.dtypes
```

Get price oracle of `allowedTokens`.

In[11]:
```python
df_price_oracle = pd.DataFrame.from_dict([allowedTokens[x] for x in allowedTokens])
df_price_oracle = df_price_oracle.set_index('symbol', drop=True).transpose()
df_price_oracle.columns = ['Price_'+x for x in df_price_oracle.columns]
df_price_oracle[[x.replace('Price','Decimals') for x in df_price_oracle.columns]] = df_price_oracle.loc['decimals',:]
df_price_oracle = df_price_oracle.drop(index = 'decimals')

df_price_oracle = df_price_oracle.reset_index()
df_price_oracle = df_price_oracle.rename(columns={'index': 'Price_Asset'})
df_price_oracle['Price_Asset'] = df_price_oracle['Price_Asset'].apply(lambda x: x.replace('Price_',''))

df_price_oracle['batchtime'] = batchtime

#For compatability with BQ data types 
numeric_cols = [x for x in df_price_oracle.columns if x not in ['Price_Asset', 'batchtime']]
df_price_oracle[numeric_cols] = df_price_oracle[numeric_cols].astype('float64')

df_price_oracle
```

