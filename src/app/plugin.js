const { ChainlinkPlugin, MainnetPriceFeeds } = require("@chainsafe/web3-plugin-chainlink");
const { Web3 } = require("web3");

const web3 = new Web3("https://ethereum.publicnode.com");
const chainlinkPlugin = new ChainlinkPlugin();

web3.registerPlugin(chainlinkPlugin);

export async function getEthprice() {
  try {
    const ethPrice = await chainlinkPlugin.getPrice(MainnetPriceFeeds.EthUsd);
    console.log("ETH price is", String(ethPrice.answer).slice(0,6));

    // Verifica si ethPrice.answer es un BigInt y conviértelo a Number antes de dividir
    const answer = typeof ethPrice.answer === 'bigint' ? Number(ethPrice.answer) : ethPrice.answer;

    // Realiza la división como un número flotante
    const formattedPrice = answer / 1000000;

    // Redondea a dos decimales
    const finalPrice = formattedPrice.toFixed(2);

    return finalPrice;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return "Error";
  }
}