var BigNumber = (new Web3()).toBigNumber(0).constructor;

App = {
    web3Provider: null,
    contracts: {},
    ponziContract: null,
    state: {},

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            App.web3Provider = new Web3(App.web3Provider);
        }

        console.log(web3)

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Hourglass.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var PonziTokenArtifact = data;
            App.contracts.PonziToken = TruffleContract(PonziTokenArtifact);

            // Set the provider for our contract
            App.contracts.PonziToken.setProvider(App.web3Provider);

            // Use our contract to retrieve and display the current prices
            return App.getContractInstance();
        }
      );

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '#buy-coins', App.handleBuy);
        $(document).on('click', '#sell-coins', App.handleSell);
        $(document).on('click', '#reinvest', App.handleReinvest);
        $(document).on('click', '#cash-out', App.handleCashout);
        $(document).on('keyup', '#buy-amount', App.convertBuyAmount);
        setInterval(App.refreshData, 5000);
    },

    getContractInstance: function () {
        App.contracts.PonziToken.deployed().then(function (instance) {
            App.ponziContract = instance;
            App.fetchExchangeRates();
            return App.refreshData();
        }).catch(function (err) {
            console.log("Problem attaching to contract instance:")
            return console.log(err.message)
        });
    },

    prettify: function (bigNumber) {
        return bigNumber.lt(1e7) ? bigNumber.toFixed(6) : bigNumber.toExponential(4);
    },

    updatePage: function () {
        if (App.state.contractBalance) $('#contract-balance').text(App.prettify(App.state.contractBalance));
        if (App.state.tokenSupply) $('#contract-token-supply').text(App.prettify(App.state.tokenSupply));

        if (App.state.buyPrice) {
            $('#coin-buy-price').text(App.prettify(App.state.buyPrice));
            if (App.state.ETHUSD) $('#coin-buy-price-USD').text(App.prettify(App.state.buyPrice.times(App.state.ETHUSD)));
            if (App.state.ETHEUR) $('#coin-buy-price-EUR').text(App.prettify(App.state.buyPrice.times(App.state.ETHEUR)));
            if (App.state.ETHJPY) $('#coin-buy-price-JPY').text(App.prettify(App.state.buyPrice.times(App.state.ETHJPY)));
        }
        if (App.state.sellPrice) {
            $('#coin-sell-price').text(App.prettify(App.state.sellPrice));
            if (App.state.ETHUSD) $('#coin-sell-price-USD').text(App.prettify(App.state.sellPrice.times(App.state.ETHUSD)));
            if (App.state.ETHEUR) $('#coin-sell-price-EUR').text(App.prettify(App.state.sellPrice.times(App.state.ETHEUR)));
            if (App.state.ETHJPY) $('#coin-sell-price-JPY').text(App.prettify(App.state.sellPrice.times(App.state.ETHJPY)));
        }
        if (App.state.myTokens) {
            $('#my-tokens').text(App.prettify(App.state.myTokens));
            if (App.state.sellPrice) {
                $('#my-tokens-ETH').text(App.prettify(App.state.myTokens.times(App.state.sellPrice)));
                if (App.state.ETHUSD) $('#my-tokens-USD').text(App.prettify(App.state.myTokens.times(App.state.sellPrice).times(App.state.ETHUSD)));
            }
        }
        if (App.state.myDividends) {
            $('#my-dividends').text(App.prettify(App.state.myDividends));
            if (App.state.ETHUSD) $('#my-dividends-USD').text(App.prettify(App.state.myDividends.times(App.state.ETHUSD)));
        }
    },

    convertBuyAmount: function () {
        var buyAmount = $('#buy-amount').val();
        if (buyAmount && App.state.ETHUSD) {
            var buyAmtBig = new BigNumber(buyAmount);
            $("#buy-amount-USD").text(buyAmtBig.times(App.state.ETHUSD));
        } else {
            $("#buy-amount-USD").text("0.00");
        }
    },

    refreshData: function () {
        App.ponziContract.totalEthereumBalance.call().then(function (contractBalanceInWei) {
            App.state.contractBalance = web3.fromWei(contractBalanceInWei, "ether")
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem checking contract balance:");
            return console.log(err.message);
        });

        App.ponziContract.totalSupply.call().then(function (totalSupply) {
            App.state.tokenSupply = web3.fromWei(totalSupply, "ether")
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem checking contract token supply:");
            return console.log(err.message);
        });

        App.ponziContract.checkBuyPrice.call().then(function (buyPriceInWei) {
            App.state.buyPrice = web3.fromWei(buyPriceInWei, "ether")
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem checking buy price:");
            return console.log(err.message);
        });

        App.ponziContract.checkSellPrice.call().then(function (sellPriceInWei) {
            App.state.sellPrice = web3.fromWei(sellPriceInWei, "ether")
            App.updatePage();
        }).catch(function (err) {
            console.log("Problem checking sell price:");
            return console.log(err.message);
        });

        App.ponziContract.myTokens.call().then(function (tokens) {
            App.state.myTokens = web3.fromWei(tokens, "ether");
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem checking my tokens:");
            return console.log(err.message);
        });

        App.ponziContract.myDividends.call().then(function (tokens) {
            App.state.myDividends = web3.fromWei(tokens, "ether");
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem checking my dividends:");
            return console.log(err.message);
        });
    },

    fetchExchangeRates: function () {

        fetch("https://api.coinbase.com/v2/prices/ETH-USD/sell").then(function (response) {
            return response.json();
        }).then(function (json) {
            App.state.ETHUSD = json.data.amount;
            App.convertBuyAmount();
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem fetching ETHUSD price:");
            return console.log(err.message);
        });

        fetch("https://api.coinbase.com/v2/prices/ETH-EUR/sell").then(function (response) {
            return response.json();
        }).then(function (json) {
            App.state.ETHEUR = json.data.amount;
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem fetching ETHEUR price:");
            return console.log(err.message);
        });

        fetch("https://api.coinbase.com/v2/prices/ETH-JPY/sell").then(function (response) {
            return response.json();
        }).then(function (json) {
            App.state.ETHJPY = json.data.amount;
            return App.updatePage();
        }).catch(function (err) {
            console.log("Problem fetching ETHJPY price:");
            return console.log(err.message);
        });
    },

    handleBuy: function (event) {
        event.preventDefault();
        console.log("Starting buy...");

        var purchaseAmountInEth = $('#buy-amount').val();
        var purchaseAmountInWei = purchaseAmountInEth * 1e18;
        console.log("Buying " + purchaseAmountInWei + " wei.");

        App.ponziContract.buy({ value: purchaseAmountInWei }).then(function (result) {
            alert('Buy transaction sent to blockchain. Please await confirmation.');
        }).catch(function (err) {
            console.log("Error in buy function:");
            console.log(err.message);
        });
    },

    handleSell: function (event) {
        event.preventDefault();
        console.log("Starting sell...");

        App.ponziContract.sell().then(function (result) {
            alert('Sell transaction sent to blockchain. Please await confirmation.');
        }).catch(function (err) {
            console.log("Error in sell function:");
            console.log(err.message);
        });
    },

    handleReinvest: function (event) {
        event.preventDefault();
        console.log("Starting reinvest...");

        App.ponziContract.reinvest().then(function (result) {
            alert('Reinvest transaction sent to blockchain. Please await confirmation.');
        }).catch(function (err) {
            console.log("Error in reinvest function:");
            console.log(err.message);
        });
    },

    handleCashout: function (event) {
        event.preventDefault();
        console.log("Starting cashout...");

        App.ponziContract.withdraw().then(function (result) {
            alert('Withdraw transaction sent to blockchain. Please await confirmation.');
        }).catch(function (err) {
            console.log("Error in withdraw function:");
            console.log(err.message);
        });
    }

};

$(function () {
   App.init();
});
