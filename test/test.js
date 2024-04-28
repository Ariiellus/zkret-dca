const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DCAContract", function () {
  it("should deploy DCAContract correctly", async function () {
    const DCAContract = await ethers.getContractFactory("DCAContract");

    // Ensure these addresses and values are correct for your deployment context
    const uniswapRouterAddress = "0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95";
    const ghoTokenAddress = "0xD9692f1748aFEe00FACE2da35242417dd05a8615";
    const wethAddress = "0xD9692f1748aFEe00FACE2da35242417dd05a8615"; // Ensure this is correct
    const intervalInSeconds = 60;

    const dcaContract = await DCAContract.deploy(
      uniswapRouterAddress,
      ghoTokenAddress,
      wethAddress,
      intervalInSeconds
    );

    // Await the transaction to be mined
    await dcaContract.deployTransaction.wait();

    console.log("DCAContract deployed to:", dcaContract.address);

    // Example of an assertion you might use, adjust according to your contract's functions
    // expect(await dcaContract.someFunction()).to.equal(someExpectedResult);
  });
});
