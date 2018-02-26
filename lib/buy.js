var Bridge = {
    properties: {
        PubKey: "0xb3775fb83f7d12a36e0475abdd1fca35c091efbe",
        ABI: [{"constant":true,"inputs":[{"name":"_customerAddress","type":"address"}],"name":"dividendsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ethereumToSpend","type":"uint256"}],"name":"calculateTokensReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokensToSell","type":"uint256"}],"name":"calculateEthereumReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"onlyAmbassadors","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"administrators","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stakingRequirement","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_includeReferralBonus","type":"bool"}],"name":"myDividends","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalEthereumBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_customerAddress","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amountOfTokens","type":"uint256"}],"name":"setStakingRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_identifier","type":"bytes32"},{"name":"_status","type":"bool"}],"name":"setAdministrator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"disableInitialStage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"},{"name":"_amountOfTokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_symbol","type":"string"}],"name":"setSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amountOfTokens","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_referredBy","type":"address"}],"name":"buy","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"incomingEthereum","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"},{"indexed":true,"name":"referredBy","type":"address"}],"name":"onTokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"tokensBurned","type":"uint256"},{"indexed":false,"name":"ethereumEarned","type":"uint256"}],"name":"onTokenSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumReinvested","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"}],"name":"onReinvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumWithdrawn","type":"uint256"}],"name":"onWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"}],
        Contract: null,
        LastBlock: 0,
        NewBlock: 0,
        processedTxs: {},
        conversationRates: {}
    },

    blockchain: {},

    events: {
        onBuyPriceInputChange: function(){

            var input = $(this).val();
            if(parseFloat(input)){
                var serialized = Bridge.properties.Web3.toBigNumber(input * 1e18) 
                Bridge.blockchain.calculateTokensReceived(serialized).then(function(_tokens){
                    return jQuery(".buy .approx").html(`Approximately ${(_tokens / 1e18).toFixed(4)} Tokens..`)
                })
            } else {
                jQuery(".buy .approx").html(`Type a valid number.`)
            }
        },

        onBuyButtonSubmit: function(){
            var input = $(".buy input").val();
            var masternode = (localStorage.getItem("masternode") && Bridge.properties.Web3.isAddress(localStorage.getItem("masternode")) ? localStorage.getItem("masternode") : "0x0")
            if(parseFloat(input)){
                Bridge.properties.Contract.buy(masternode, { value:web3.toWei(input, "ether") }, function(err, res){
                    if(err){
                        alertify.error("An error occured. Please check the logs.");
                        console.log("An error occured", err)
                    } else {
                        alertify.logPosition("bottom left");
                        alertify.log("Buy order has been transmitted to the blockchain. Awaiting confirmation..")
                    } 
                });
            } else {
                alertify.error("Please type a valid number.");
            }
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
                        return jQuery(".sell .approx").html(`Approximately ${(_ethereum / 1e18).toFixed(4)} Eth..`)
                    } else {
                        return jQuery(".sell .approx").html(`You don't have this many tokens.`)
                    }
                })
            } else {
               jQuery(".sell .approx").html(`Type a valid number.`)
            }
        },

        onSellButtonSubmit: function(){
            var input = $(".sell input").val();
            if(parseFloat(input)){
                var serialized = Bridge.properties.Web3.toBigNumber(input * 1e18)
                Bridge.properties.Contract.sell(serialized, function(err, res){
                    if(err){
                        alertify.error("An error occured. Please check the logs.");
                        console.log("An error occured", err)
                    } else {
                        alertify.logPosition("bottom left");
                        alertify.log("Sell order has been transmitted to the blockchain. Awaiting confirmation..")
                    } 
                });
            } else {
                alertify.error("Please type a valid number.");
            }
        },

        onTransferButtonSubmit: function(){
            var addy = $("#transferAddress").val();
            var tokens = $("#transferTokenCount").val();
            if(!Bridge.properties.Web3.isAddress(addy)){
                return jQuery(".transfer .approx").html("Invalid wallet address...")
            }
            if(!parseFloat(tokens)){
                return jQuery(".transfer .approx").html("Invalid amount of tokens...")
            }

            var serialized = Bridge.properties.Web3.toBigNumber(tokens * 1e18)
            return Bridge.blockchain.myTokens().then(function(_myTokens){
                if(parseFloat(serialized) <= parseFloat(_myTokens)){
                    return Bridge.properties.Contract.transfer(addy, serialized, function(err, res){
                        if(err){
                            alertify.error("An error occured. Please check the logs.");
                            console.log("An error occured", err)
                        } else {
                            alertify.logPosition("bottom left");
                            alertify.log("Sell order has been transmitted to the blockchain. Awaiting confirmation..")
                        } 
                    });
                } else {
                    return false;
                }
            })

            
        },

        onReinvestButtonSubmit: function(){
            Bridge.properties.Contract.reinvest(function(err, res){
                if(err){
                    alertify.error("An error occured. Please check the logs.");
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
                    alertify.error("An error occured. Please check the logs.");
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
            jQuery.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR')
            .then(function(_res){
                Bridge.properties.conversationRates = _res
                // fetch blockchain data
                return Promise.all([
                    Bridge.blockchain.totalEthereumBalance(),
                    Bridge.blockchain.totalSupply(),
                    Bridge.blockchain.myTokens(),
                    Bridge.blockchain.myDividends(true),
                    Bridge.blockchain.buyPrice(),
                    Bridge.blockchain.sellPrice(),
                    Bridge.blockchain.stakingRequirement(),
                ])

            })
            .then(function(_contractData){
                console.log('fetched blockchain data')

                // calculate tokens price in eth/usd
                return Bridge.blockchain.calculateEthereumReceived(_contractData[2])
                .then(function(_ethereumReceived){
                     // update frontend
                    return Promise.all([
                        new Promise(function(){
                            if(_contractData[2].greaterThanOrEqualTo(_contractData[6])){
                               return Promise.all([
                                    jQuery(".masternode").removeClass("hidden"),
                                    jQuery(".masternode .link a").html(`https://powhcoin.com/buy.html?masternode=${Bridge.properties.Web3.eth.coinbase}`),
                                    jQuery(".masternode .link a").attr('href', `https://powhcoin.com/buy.html?masternode=${Bridge.properties.Web3.eth.coinbase}`)
                                    //jQuery("")
                               ])
                            } else {
                                return jQuery(".masternode").addClass("hidden")
                            }
                        }),
                        jQuery("#loadingSpinner").removeClass("active"),
                        jQuery("#loadingSpinner").addClass("inactive"),
                        jQuery("#ethInContract").html(`${_contractData[0].div(1e18).toFixed(4)} eth`),
                        jQuery("#tokensInCirculation").html(`${_contractData[1].div(1e18).toFixed(1)} tokens`),
                        jQuery("#myTokens .count").html(`${_contractData[2].div(1e18).toFixed(4)}`),
                        jQuery("#myTokens .converted").html(`(${((_ethereumReceived.div(1e18)) * Bridge.properties.conversationRates.USD).toFixed(2)} USDT)`),
                        jQuery("#myDividends .converted").html(`(${((_contractData[3].div(1e18)) * Bridge.properties.conversationRates.USD).toFixed(2)} USDT)`),
                        jQuery("#myDividends .count").html(`${_contractData[3].div(1e18).toFixed(4)}`),
                        jQuery(".buy .buyPrice").html(`${_contractData[4].div(1e18).toFixed(4)} eth/token`),
                        jQuery(".sell .sellPrice").html(`${_contractData[5].div(1e18).toFixed(4)} eth/token`),
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

                        case 'Transfer':
                            if(isCurrentCustomer){
                                alertify.success(`Your transfer order is confirmed! ${_tx.args.to} received ${_tx.args.tokens.div(1e18).toFixed(4)}. tokens.`)
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
            Promise.promisify(Bridge.properties.Web3.eth.getBlockNumber),
            Promise.promisify(Bridge.properties.Contract.sellPrice),
            Promise.promisify(Bridge.properties.Contract.stakingRequirement),
            Promise.promisify(Bridge.properties.Contract.transfer),
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
        Bridge.blockchain.sellPrice = _promisfied[9]
        Bridge.blockchain.stakingRequirement = _promisfied[10]
        Bridge.blockchain.transfer = _promisfied[11]

        // hook dom interaction event listeners
        return Promise.all([
            jQuery(".buy input").bind('input', _.throttle(Bridge.events.onBuyPriceInputChange, 800)),
            jQuery(".sell input").bind('input', _.throttle(Bridge.events.onSellPriceInputChange, 800)),
            jQuery(".buy button").on('click', Bridge.events.onBuyButtonSubmit),
            jQuery(".sell button").on('click', Bridge.events.onSellButtonSubmit),
            jQuery(".transfer button").on('click', Bridge.events.onTransferButtonSubmit),
            jQuery("#reinvest").on('click', Bridge.events.onReinvestButtonSubmit),
            jQuery("#withdraw").on('click', Bridge.events.onWithdrawButtonSubmit)
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