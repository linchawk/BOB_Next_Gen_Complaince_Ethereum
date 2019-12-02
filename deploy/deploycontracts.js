const fs = require('fs');
const readline = require('readline');
const solc = require('solc');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));

getContractsToBeDeployed();

function getContractsToBeDeployed() {
    var rd = readline.createInterface({
        input: fs.createReadStream('deploy.txt'),
        output: process.stdout,
        console: false
    });
    rd.on('line', function(line) {
        if(line) {
            deploy = line.split('|');
            deployContract(deploy[0], deploy[1], deploy[2], deploy[3], 1000000*2);
        }
    });
}

function deployContract(fileName, contractName, account, passphrase, _gas) {
    console.log("Attempting to deploy contract " + contractName);
    var input = fs.readFileSync(fileName);    
    var output = solc.compile(input.toString(), 1);
    //console.log(output);
    var bytecode = output.contracts[':' + contractName].bytecode;
    var abi = JSON.parse(output.contracts[':' + contractName].interface);
    
    //Unlock personal account
    if(web3.personal.unlockAccount(account, passphrase)) {
        console.log('Account ' + account + ' unlocked');
    }
    else {
        console.log('Could not unlock account ' + account);
        return;
    }

    console.log("Deploying contract " + contractName + " to network");

    var contract = web3.eth.contract(abi);

    var contractInstance = contract.new({
        data: '0x' + bytecode,
        from: account,
        gas: _gas
        }, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            if(!res.address) {
                console.log("Contract transaction send: TransactionHash: " + res.transactionHash + " waiting to be mined...");

              } else {
                console.log("Contract mined! Address: " + res.address);
                console.log(res);
                testContract(contract, res.address, account, passphrase);
              }
    });
}

function testContract(contract, address, account, passphrase) {
    // Reference to the deployed contract
    const kycMaster = contract.at(address);

    //Unlock personal account
    if(web3.personal.unlockAccount(account, passphrase)) {
        console.log('Account ' + account + ' unlocked');
    }
    else {
        console.log('Could not unlock account ' + account);
        return;
    }

    kycMaster.KYCClient_Register("Test KYC Client", "Hyd", "Bank",  {from: account, value: 1e19, gas: 1000000*2 }, (err, res) => {
        // Log transaction, in case you want to explore
        if(err) {            
            console.log(err);
            return;
        }
        console.log('tx: ' + res);        
        //const balance = kycMaster.KYCClient_GetBalance.call({from:account}).c[0];
        const name = kycMaster.KYCClient_GetName.call({from:account});
        console.log(name);
    });
}