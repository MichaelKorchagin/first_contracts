const { ethers } = require("hardhat");
const { expect } = require("chai");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("Create and swap tokens", function () {

    let KMDToken;
    let KKDToken;
    let SwapTokens;
    let kmdToken;
    let kkdToken;
    let swapTokens;

    beforeEach(async function() {
        KMDToken = await ethers.getContractFactory("KMDToken");
        KKDToken = await ethers.getContractFactory("KKDToken");
        SwapTokens = await ethers.getContractFactory("SwapTokens");
        kmdToken = await KMDToken.deploy("KMDToken", "KMD");
        await kmdToken.deployed();
        kkdToken = await KKDToken.deploy("KKDToken", "KKD");
        await kkdToken.deployed();
        // swapTokens = await SwapTokens.deploy(kmdToken.address, kkdToken.address, "2");
        // await swapTokens.deployed();
    });

    it('should be deployed KMD with correct address', function () {
        expect(kmdToken.address).to.be.properAddress;
        console.log(kmdToken.address);
    });

    it('should have 50 ethers by default', async function () {
        const ownerContract = (await ethers.getSigner()).address;
        console.log(ownerContract);
        const balance = await kmdToken.balanceOf(ownerContract);
        console.log(balance);
        expect(balance).to.eq(50);
    });
});