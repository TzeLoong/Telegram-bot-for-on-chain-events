# Telegram-bot-for-on-chain-events

Utilising Alchemy's Custom Webhooks to build a Telegram bot to listen for on-chain transfer events using Typescript.

The processing of doing this project taught me how to get and process raw blockchain event data from Alchemy with web hooks. 

In this case, the transfer of DAI emits a transfer event which is stored on chain as part of the Transaction Receipt Event Logs.  
The telegram bot tracks logs from the DAI contract that have the Transfer signature and extracts transfer details using the topics and data field of the log to retrieve the sender, recipient and value of transfer. 

If there aren’t any Dai transfer logs in the block that alchemy sent, the log section will just be empty. 

Special thanks to Alchemy for the tutorial. 
