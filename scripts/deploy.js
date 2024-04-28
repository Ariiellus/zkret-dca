const { ethers } = require("hardhat");

async function main() {
    const DCAContract = await ethers.getContractFactory("DCAContract");

    // Make sure to use the correct constructor arguments
    const dca = await DCAContract.deploy(
        "0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95",   // Example Uniswap router address
        "0xD9692f1748aFEe00FACE2da35242417dd05a8615",   // Example GHO token address
        "0xD9692f1748aFEe00FACE2da35242417dd05a8615",   // Example WETH address, ensure this is correct
        60                                             // Interval for the DCA operation, in seconds
    );

    // Await the deployment to be processed by the network
    await dca.deployTransaction.wait();

    console.log("DCAContract deployed to:", dca.address);
}

main().then(() => process.exit(0))
    .catch(error => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
