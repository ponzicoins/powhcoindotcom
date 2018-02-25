var BigNumber = (new Web3()).toBigNumber(0).constructor;

var Bridge = {
    properties: {
        PubKey: "0x488D2723E24E918f48F8fAF7Df7efa6613Fe25E8",
        ABI: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"checkBuyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"checkSellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myDividends","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalEthereumBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokenBalanceLedger","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"incomingEthereum","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"}],"name":"onTokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"tokensBurned","type":"uint256"},{"indexed":false,"name":"ethereumEarned","type":"uint256"}],"name":"onTokenSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumReinvested","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"}],"name":"onReinvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumWithdrawn","type":"uint256"}],"name":"onWithdraw","type":"event"}],
        Contract: null,
    },

    blockchain: {},

    methods: {
        connectWithMetamask: function(){
            if (typeof web3 !== 'undefined') {
                return Promise.resolve(new Web3(web3.currentProvider))
            } else {
                $('loadingText').innerHTML("MetaMask not found. Please activate MetaMask and refresh the page.")
                return Promise.reject(false)
            }
        },
        connectWithContract: function(){
            return web3.eth
            .contract(Bridge.properties.ABI)
            .at(Bridge.properties.PubKey)
        },
        fetchContractData: function(){
            return Promise.all([
                Bridge.blockchain.totalEthereumBalance(),
                Bridge.blockchain.totalSupply(),
                Bridge.blockchain.myTokens(),
                Bridge.blockchain.myDividends(),
                Bridge.blockchain.checkBuyPrice(),
                Bridge.blockchain.checkSellPrice(),
            ])
        }
    }
}


jQuery(function(){
    console.log('start')

    // hook web3 
    Bridge.methods.connectWithMetamask()
    .then(function(_web3){
        console.log('hooked web3')
        
        // store web3
        Bridge.properties.Web3 = _web3
        Bridge.properties.Web3.eth.defaultAccount = Bridge.properties.Web3.eth.accounts[0]

        // connect with contract
        return Bridge.methods.connectWithContract()
    })
    .then(function(_contract){
        console.log('hooked contract')

        // store contract
        Bridge.properties.Contract = _contract

        // promisify fucking web3 callbacks
        return Promise.all([
            Promise.promisify(Bridge.properties.Contract.totalEthereumBalance),
            Promise.promisify(Bridge.properties.Contract.totalSupply),
            Promise.promisify(Bridge.properties.Contract.myTokens),
            Promise.promisify(Bridge.properties.Contract.myDividends),
            Promise.promisify(Bridge.properties.Contract.checkBuyPrice),
            Promise.promisify(Bridge.properties.Contract.checkSellPrice),
        ])
    })
    .then(function(_promisfied){
        console.log('promisified callbacks')

        // store promisified functions
        Bridge.blockchain.totalEthereumBalance = _promisfied[0]
        Bridge.blockchain.totalSupply = _promisfied[1]
        Bridge.blockchain.myTokens = _promisfied[2]
        Bridge.blockchain.myDividends = _promisfied[3]
        Bridge.blockchain.checkBuyPrice = _promisfied[4]
        Bridge.blockchain.checkSellPrice = _promisfied[5]

        // fetch data using promisified functions
        return Bridge.methods.fetchContractData()
    })
    .then(function(_contractData){
        console.log('fetched blockchain data')
        // update frontend
        return Promise.all([
            jQuery("#loadingSpinner").removeClass("active"),
            jQuery("#loadingSpinner").addClass("inactive"),
            jQuery("#ethInContract").html(`${_contractData[0].div(1e18).toFixed(4)} eth`),
            jQuery("#tokensInCirculation").html(`${_contractData[1].div(1e18).toFixed(4)} tokens`),
            jQuery("#myTokens .count").html(`${_contractData[2].div(1e18).toFixed(4)}`),
            jQuery("#myDividends .count").html(`${_contractData[3].div(1e18).toFixed(4)}`),
            //jQuery(".buy .approx").html(`Approximately ${_contractData[4].div(1e18).toFixed(6)} Tokens..`),

            //jQuery(".sell .approx").html(`Approximately ${_contractData[5].div(1e18).toFixed(2)} Eth..`)
        ])
    })
    .catch(function(err){
        console.log("Something went wrong.", err)
    })
    

})