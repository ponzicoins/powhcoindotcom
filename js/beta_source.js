var Bridge = {
    properties: {
        PubKey: "0x26bAc64b2042c3e83CFf7c1761e684cfD7265077", // "0xeBfDF01fCe78D04D7884DB6eB41b4Ae808BBae1d",
        ABI: [{"constant":true,"inputs":[{"name":"_customerAddress","type":"address"}],"name":"dividendsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ethereumToSpend","type":"uint256"}],"name":"calculateTokensReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokensToSell","type":"uint256"}],"name":"calculateEthereumReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myDividends","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalEthereumBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_customerAddress","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_amountOfTokens","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"incomingEthereum","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"}],"name":"onTokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"tokensBurned","type":"uint256"},{"indexed":false,"name":"ethereumEarned","type":"uint256"}],"name":"onTokenSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumReinvested","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"}],"name":"onReinvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumWithdrawn","type":"uint256"}],"name":"onWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"identifier","type":"string"},{"indexed":false,"name":"val","type":"uint256"}],"name":"Debug","type":"event"}],
        Contract: null,
        LastBlock: 0,
        NewBlock: 0,
        processedTxs: {},
        conversationRates: {}
    },

    blockchain: {},

    events: {
        onBuyPriceInputChange: function(){

            var input = $(".buy input").val();
            if (parseFloat(input)) {
                jQuery(".buy .converted").html(`${(input * Bridge.properties.conversationRates.USD).toFixed(2)}`)
                var serialized = Bridge.properties.Web3.toBigNumber(input * 1e18) 
                Bridge.blockchain.calculateTokensReceived(serialized).then(function(_tokens){
                    return jQuery(".buy .approx").html(`Approx. ${(_tokens / 1e18).toFixed(4)} P3D`)
                })
            } else {
                jQuery(".buy .converted").html("0.00")
                jQuery(".buy .approx").html(`Type a valid number.`)
            }
        },

        onBuyButtonSubmit: function(){
            var input = $(".buy input").val();
            if(parseFloat(input)){
                Bridge.properties.Contract.buy({
                    value: web3.toWei(input, "ether")
                }, function(err, res){
                    if(err){
                        alertify.alert("An error occured. Please check the logs.");
                        console.log("An error occured", err)
                    } else {
                        alertify.logPosition("bottom left");
                        alertify.log("Buy order has been transmitted to the blockchain. Awaiting confirmation..")
                    } 
                });
            } else {
                alertify.alert("Please type a valid number.");
            }
        },

        onTokenCountClick: function() {
            $(".sell input").val(Bridge.properties.myTokens)
        },

        onSellPriceInputChange: function(){
            var input = $(this).val();
            if(parseFloat(input)){
                var serialized = Bridge.properties.Web3.toBigNumber(input * 1e18)

                Bridge.blockchain.myTokens().then(function(_myTokens){
                    if(parseFloat(serialized) <= parseFloat(_myTokens)){
                        return Bridge.blockchain.calculateEthereumReceived(serialized)
                    } else {
                        return false;
                    }
                })
                .then(function(_ethereum){
                    if(_ethereum){
                        return jQuery(".sell .approx").html(`Approx. ${(_ethereum / 1e18).toFixed(4)} ETH | USD₮ ${(Bridge.properties.conversationRates.USD * _ethereum / 1e18).toFixed(2)}`)
                    } else {
                        return jQuery(".sell .approx").html(`You don't have this many tokens.`)
                    }
                })
            } else {
               jQuery(".sell .approx").html(`Type a valid number.`)
            }
        },

        onSellButtonSubmit: function () {
            var input = $(".sell input").val();
            if(parseFloat(input)){
                var serialized = Bridge.properties.Web3.toBigNumber(input * 1e18)
                Bridge.properties.Contract.sell(serialized, function(err, res){
                    if(err){
                        alertify.alert("An error occured. Please check the logs.");
                        console.log("An error occured", err)
                    } else {
                        alertify.logPosition("bottom left");
                        alertify.log("Sell order has been transmitted to the blockchain. Awaiting confirmation..")
                    } 
                });
            } else {
                alertify.alert("Please type a valid number.");
            }
        },

        onReinvestButtonSubmit: function(){
            Bridge.properties.Contract.reinvest(function(err, res){
                if(err){
                    alertify.alert("An error occured. Please check the logs.");
                    console.log("An error occured", err)
                } else {
                    alertify.logPosition("bottom left");
                    alertify.log("Reinvest order has been transmitted to the blockchain. Awaiting confirmation..")
                } 
            });
        },

        onWithdrawButtonSubmit: function(){
            Bridge.properties.Contract.withdraw(function(err, res){
                if(err){
                    alertify.alert("An error occured. Please check the logs.");
                    console.log("An error occured", err)
                } else {
                    alertify.logPosition("bottom left");
                    alertify.log("Withdrawal request has been transmitted to the blockchain. Awaiting confirmation..")
                } 
            });
        }
    },


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
        refreshData: function(){

            // fetch conversation rates
            jQuery.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR,JPY')
            .then(function(_res){
                Bridge.properties.conversationRates = _res

                // fetch blockchain data
                return Promise.all([
                    Bridge.blockchain.totalEthereumBalance(),
                    Bridge.blockchain.totalSupply(),
                    Bridge.blockchain.myTokens(),
                    Bridge.blockchain.myDividends(),
                    Bridge.blockchain.buyPrice()
                ])
            })
            .then(function(_contractData){
                console.log('fetched blockchain data')
                Bridge.properties.myTokens = _contractData[2].div(1e18)

                // calculate tokens price in eth/usd
                return Bridge.blockchain.calculateEthereumReceived(_contractData[2])
                .then(function(_ethereumReceived){
                     // update frontend
                    return Promise.all([
                        jQuery("#loadingSpinner").removeClass("active"),
                        jQuery("#loadingSpinner").addClass("inactive"),
                        jQuery("#ethInContract").html(`${_contractData[0].div(1e18).toFixed(4)} eth`),
                        jQuery("#tokensInCirculation").html(`${_contractData[1].div(1e18).toFixed(1)} tokens`),
                        jQuery("#myTokens .count").html(`${_contractData[2].div(1e18).toFixed(4)}`),
                        jQuery("#myTokens .eth-value").html(`${_ethereumReceived.div(1e18).toFixed(4)}`),
                        jQuery("#myTokens .converted").html(`${((_ethereumReceived.div(1e18)) * Bridge.properties.conversationRates.USD).toFixed(2)}`),
                        jQuery("#myDividends .converted").html(`${((_contractData[3].div(1e18)) * Bridge.properties.conversationRates.USD).toFixed(2)}`),
                        jQuery("#myDividends .count").html(`${_contractData[3].div(1e18).toFixed(4)}`),
                        jQuery("#coin-buy-price").html(`${_contractData[4].div(1e18).toFixed(4)}`),
                        jQuery("#coin-buy-price-USD").html(`${((_contractData[4].div(1e18)) * Bridge.properties.conversationRates.USD).toFixed(2)}`),
                        jQuery("#coin-buy-price-EUR").html(`${((_contractData[4].div(1e18)) * Bridge.properties.conversationRates.EUR).toFixed(2)}`),
                        jQuery("#coin-buy-price-JPY").html(`${((_contractData[4].div(1e18)) * Bridge.properties.conversationRates.JPY).toFixed(2)}`),
                        Bridge.events.onBuyPriceInputChange()
                    ])
                })
            })
            .then(function(){
                 console.log('parsed frontend stats')
                return Bridge.blockchain.getBlockNumber()
            })
            .then(function(_blockNum){
                Bridge.properties.NewBlock = _blockNum;
                if(Bridge.properties.LastBlock == Bridge.properties.NewBlock) return false
                console.log("block diff found, reiterating through txs")

                
                _allEvents = Bridge.properties.Contract.allEvents({fromBlock: Bridge.properties.LastBlock, toBlock: Bridge.properties.NewBlock})
                return new Promise(function(resolve, reject){
                    _allEvents.get(function(_err, _txs){
                        if(_err) return reject(_err)
                        return resolve(_txs)
                    })
                })
            })
            .then(function(_txs){
                
                if(!_txs) return
               
                return Promise.each(_txs, function(_tx){
                    // console.log(_tx)
                    var isCurrentCustomer = Bridge.properties.Web3.eth.accounts[0] == _tx.args.customerAddress

                    // prevent duplicates
                    if(Bridge.properties.processedTxs[_tx.transactionIndex] == true) return
                    Bridge.properties.processedTxs[_tx.transactionIndex] = true
                    console.log("found new tx")

                    if(isCurrentCustomer){
                        alertify.logPosition("bottom left")
                    } else {
                        alertify.logPosition("bottom right");
                    }

                    switch(_tx.event){
                        case 'onTokenPurchase':
                            if(isCurrentCustomer){
                                alertify.success(`Your buy order is confirmed! You spent ${_tx.args.incomingEthereum.div(1e18).toFixed(4)} ethereum and received ${_tx.args.tokensMinted.div(1e18).toFixed(4)} tokens.`)
                            } else {
                                alertify.log(`Someone else bought tokens. They spent ${_tx.args.incomingEthereum.div(1e18).toFixed(4)} ethereum and received ${_tx.args.tokensMinted.div(1e18).toFixed(4)} tokens.`)
                            }
                        break;
                        case 'onTokenSell':
                            if(isCurrentCustomer){
                                alertify.success(`Your sell order is confirmed! You received ${_tx.args.ethereumEarned.div(1e18).toFixed(4)} for ${_tx.args.tokensBurned.div(1e18).toFixed(4)} tokens.`)
                            } else {
                                alertify.log(`Someone else sold tokens. They received ${_tx.args.ethereumEarned.div(1e18).toFixed(4)} for ${_tx.args.tokensBurned.div(1e18).toFixed(4)} tokens.`)
                            }
                        break;

                        case 'onWithdraw':
                            if(isCurrentCustomer){
                                alertify.success(`Your withdrawal request is confirmed! You received ${_tx.args.ethereumWithdrawn.div(1e18).toFixed(4)}.`)
                            }
                        break;

                        case 'onReinvestment':
                            if(isCurrentCustomer){
                                alertify.success(`Your reinvestment order is confirmed! You received ${_tx.args.tokensMinted.div(1e18).toFixed(4)}. tokens.`)
                            }
                        break;

                    }
                })
            })
            .then(function(){
                console.log('done')
                Bridge.properties.LastBlock = Bridge.properties.NewBlock
            })
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
            Promise.promisify(Bridge.properties.Contract.calculateTokensReceived),
            Promise.promisify(Bridge.properties.Contract.calculateEthereumReceived),
            Promise.promisify(Bridge.properties.Contract.buyPrice),
            Promise.promisify(Bridge.properties.Contract.buy),
            Promise.promisify(Bridge.properties.Web3.eth.getBlockNumber)
        ])
    })
    .then(function(_promisfied){
        console.log('promisified callbacks')

        // store promisified functions
        Bridge.blockchain.totalEthereumBalance = _promisfied[0]
        Bridge.blockchain.totalSupply = _promisfied[1]
        Bridge.blockchain.myTokens = _promisfied[2]
        Bridge.blockchain.myDividends = _promisfied[3]
        Bridge.blockchain.calculateTokensReceived = _promisfied[4]
        Bridge.blockchain.calculateEthereumReceived = _promisfied[5]
        Bridge.blockchain.buyPrice = _promisfied[6]
        Bridge.blockchain.buy = _promisfied[7]
        Bridge.blockchain.getBlockNumber = _promisfied[8]

        // hook dom interaction event listeners
        return Promise.all([
            jQuery(".buy input").bind('input', _.throttle(Bridge.events.onBuyPriceInputChange, 800)),
            jQuery(".sell input").bind('input', _.throttle(Bridge.events.onSellPriceInputChange, 800)),
            jQuery(".buy button").on('click', Bridge.events.onBuyButtonSubmit),
            jQuery(".sell button").on('click', Bridge.events.onSellButtonSubmit),
            jQuery("#reinvest").on('click', Bridge.events.onReinvestButtonSubmit),
            jQuery("#withdraw").on('click', Bridge.events.onWithdrawButtonSubmit),
            jQuery("#myTokens .count").on('click', Bridge.events.onTokenCountClick)
        ])
        
    })
    .then(function(){
        return Bridge.blockchain.getBlockNumber()
    })
    .then(function(_blockNum){
        Bridge.properties.LastBlock = _blockNum
        return setInterval(Bridge.methods.refreshData, 1000)
    })
    .catch(function(err){
        console.log("Something went wrong.", err)
    })
    

})