"use client"

import Image from "next/image";
import { usePrivy } from '@privy-io/react-auth';
import React, { useEffect, useState } from 'react';
import { getEthprice } from './plugin';
import { ethers } from 'ethers';

export default function LoginPage() {
  const { login } = usePrivy();
  const [ghoAmount, setGhoAmount] = useState('');
  const [ethPriceState, setEthPriceState] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGhoAmount(event.target.value);
  };

  useEffect(() => {
    const asyncGetEthPrice = async () => {
      const ethPrice = await getEthprice();
      setEthPriceState(ethPrice);
    };
    asyncGetEthPrice();

    const setupEthers = () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = 'YOUR_CONTRACT_ADDRESS';  // Replace with your contract's address
        const contractABI = [
          "function swapGHOForWETH(uint256 amountIn, uint256 amountOutMinimum) public"
        ];
        const dcaContract = new ethers.Contract(contractAddress, contractABI, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(dcaContract);
      }
    };

    setupEthers();
  }, []);

  const handleSwap = async () => {
    if (!contract || !ghoAmount) return;

    const amountIn = ethers.utils.parseUnits(ghoAmount, 18); // Assuming GHO has 18 decimals
    const amountOutMinimum = 0; // Set this to a sensible value based on your DCA logic or expected slippage

    try {
      const txResponse = await contract.swapGHOForWETH(amountIn, amountOutMinimum);
      await txResponse.wait();
      alert('Swap executed successfully!');
    } catch (error) {
      console.error('Error executing swap:', error);
      alert('Failed to execute swap.');
    }
  };

  const displayedEthPrice = ethPriceState ? (parseFloat(ethPriceState) / 100).toFixed(2) : 'Loading...';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <header className="z-10 w-full max-w-3xl text-center font-mono text-sm mb-6">
        <p className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 to-transparent pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 rounded-xl border bg-gray-200 p-4">
          🤫 Buy ETH with privacy! 🤫
        </p>
      </header>
      <section className="flex flex-col items-center">
        <button
          className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg mb-10"
          onClick={login}
        >
          Log in
        </button>
        <Image
          className="dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/dca.svg"
          alt="DCA Example"
          width={540}
          height={111}
          priority
        />
        <div className="bg-dark-500 p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
          <div className="flex items-center justify-between mb-4 w-full">
            <input
              id="ghoAmount"
              type="text"
              value={ghoAmount}
              onChange={handleInputChange}
              className="w-full bg-gray-500 text-white rounded-lg py-2 px-4 leading-tight focus:outline-none"
              placeholder="0"
            />
            <p className="bg-gray-900 text-white py-2 px-4 rounded-lg">gho</p>
            <p className="text-black mx-2">swap for</p>
            <label className="w-full bg-gray-500 text-white rounded-lg py-2 px-4 leading-tight focus:outline-none">{displayedEthPrice}</label>
            <p className="bg-gray-900 text-white py-2 px-4 rounded-lg">ETH</p>
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="ghoAmount" className="block text-black text-sm font-bold mb-2">
              How much gho do you want to invest?
            </label>
          </div>
          <button onClick={handleSwap} className="group rounded-lg border border-gray px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 w-full">
            <span className="text-2xl font-semibold">
              Let's DCA
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
