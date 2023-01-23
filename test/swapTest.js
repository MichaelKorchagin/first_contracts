const {ethers, network} = require("hardhat");
const {expect} = require("chai");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("Create and swap tokens", function () {

    let KMDToken;
    let KKDToken;
    let SwapTokens;
    let kmdToken;
    let kkdToken;
    let swapTokens;
    let accounts;
    let price;

    before(async function () {
        accounts = await ethers.getSigners();
        price = '2';
    });

    beforeEach(async function () {
        KMDToken = await ethers.getContractFactory("KMDToken");
        KKDToken = await ethers.getContractFactory("KKDToken");
        SwapTokens = await ethers.getContractFactory("SwapTokens");
        kmdToken = await KMDToken.connect(accounts[0]).deploy("KMDToken", "KMD");
        await kmdToken.deployed();
        kkdToken = await KKDToken.connect(accounts[1]).deploy("KKDToken", "KKD");
        await kkdToken.deployed();
        swapTokens = await SwapTokens.connect(accounts[0]).deploy(kmdToken.address, kkdToken.address, price);
        await swapTokens.deployed();
    });

    it('should be deployed KMD with correct address', function () {
        expect(kmdToken.address).to.be.properAddress;
    });

    it('should be deployed KkD with correct address', function () {
        expect(kkdToken.address).to.be.properAddress;
    });

    it('should have 50 ethers KMD by default', async function () {
        const owner = accounts[0].address;
        const balance = await kmdToken.balanceOf(owner);
        expect(balance).to.eq(1000);
    });

    it('should have 100 ethers KKD by default', async function () {
        const owner = accounts[1].address;
        const balance = await kkdToken.balanceOf(owner);
        expect(balance).to.eq(500);
    });

    it('should check price that is set when deploy and correctly change her', async function () {
        let getPrice = await swapTokens.getPrice();
        expect(getPrice).to.eq(price);
        const newPrice = 15;
        await swapTokens.setPrice(newPrice);
        getPrice = await swapTokens.getPrice();
        expect(getPrice).to.eq(newPrice);
    });

    it('should catch error about zero price', async function () {
        await swapTokens.setPrice(0);
        let getPrice = await swapTokens.getPrice();
        expect(getPrice).to.be.revertedWith('Price can not = 0');
    });

    it('should send KKD to contract and send KMD to sender', async function () {
        const amountToBuy = 30;
        const kmdSendApprove = 100;
        const kkdTakeApprove = 50;

        const kkdBalanceSecondAccBeforeTransaction = await kkdToken.balanceOf(accounts[1].address);
        const kmdBalanceSecondAccBeforeTransaction = await kmdToken.balanceOf(accounts[1].address);

        await kmdToken.connect(accounts[0]).transfer(swapTokens.address, 100);

        await kmdToken.connect(accounts[0]).approve(accounts[1].address, kmdSendApprove);
        await kkdToken.approve(swapTokens.address, kkdTakeApprove);

        console.log('Second Acc KKD: ' + kkdBalanceSecondAccBeforeTransaction);
        console.log('Second Acc KMD: ' + kmdBalanceSecondAccBeforeTransaction);

        await swapTokens.connect(accounts[1]).buying(amountToBuy);

        const secondAccBalanceKKD = await kkdToken.balanceOf(accounts[1].address);
        console.log('Second Acc KKD: ' + secondAccBalanceKKD);
        expect(secondAccBalanceKKD).to.be.eq(kkdBalanceSecondAccBeforeTransaction - amountToBuy);

        const secondAccBalanceKMD = await kmdToken.balanceOf(accounts[1].address);
        console.log('Second Acc KMD: ' + secondAccBalanceKMD);
        expect(secondAccBalanceKMD).to.be.eq(kmdBalanceSecondAccBeforeTransaction + amountToBuy);

        console.log('KMD Swap: ' + await kmdToken.balanceOf(swapTokens.address));
        console.log('KKD Swap: ' + await kkdToken.balanceOf(swapTokens.address));
    });
});