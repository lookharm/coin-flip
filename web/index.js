const contractAddress = "0x22AE913ffee8aca097E38C2B960c27eB212004B6";

async function getWeb3() {
    return new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject("MetaMask!!!");
            }
        });
    })
}

async function getContract() {
    const data = await $.getJSON("./contracts/coinflip.json");
    return new web3.eth.Contract(data, contractAddress);
}

async function flip(web3, contract, accounts) {
    $('#flip-button').on('click', async () => {
        let val = $('#value-input').val();
        console.log(await contract.methods.flip().send({
            from: accounts[0],
            to: contractAddress,
            value: val,
        }));
    })
}

async function donate(web3, contract, accounts) {
    $('#donate-button').on('click', async () => {
        let val = $('#value-input').val();
        console.log(await contract.methods.donate().send({
            from: accounts[0],
            to: contractAddress,
            value: val
        }));
    })
}

async function systemBalance(web3, contract) {
    const val = await contract.methods.getBalance().call();
    setSystemBalance(val);
}

async function yourBalance(web3, contract, accounts) {
    const val = await web3.eth.getBalance(accounts[0]);
    setYourBalance(val);
}

function setSystemBalance(val) {
    $('#system-balance').text(`ระบบ: ${val} wei`);
}

function setYourBalance(val) {
    $('#your-balance').text(`คุณ: ${val} wei`);
}

function setFlipResult(result, reward) {
    if (result) {
        $('#result').text(`คุณชนะ: ${reward} wei`);
    } else {
        $('#result').text(`คุณแพ้`);
    }
}

async function startApp() {
    const web3 = await getWeb3();
    const contract = await getContract();
    const accounts = await web3.eth.getAccounts();
    
    await flip(web3, contract, accounts);
    await donate(web3, contract, accounts);
    await systemBalance(web3, contract);
    await yourBalance(web3, contract, accounts);

    //Set event
    contract.events.Flip(async (error, result) => {
        if (!error) {
            const {_reward, _result} = result.returnValues;
            await systemBalance(web3, contract);
            await yourBalance(web3, contract, accounts);        
            setFlipResult(_result, _reward);
        } else {
            console.log(error);
        }
    })
    contract.events.Donate(async (error, result) => {
        if (!error) {
            await systemBalance(web3, contract); 
        } else {
            console.log(error);
        }
    })
}

startApp();