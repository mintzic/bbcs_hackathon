"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, DollarSign, Activity } from "lucide-react";

const WalletCard = ({ balance }) => {
  const router = useRouter();

  const handleAddMoney = () => {
    router.push("/add-money");
  };

  const handleWithdraw = () => {
    router.push("/withdraw");
  };

  return (
    <div className="bg-beige text-black p-6 m-3 rounded-lg shadow-md">
      {/* Wallet Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">My Wallet</h2>
      </div>

      {/* Wallet Balance */}
      <div className="mb-6">
        <p className="text-sm text-gray-700 mb-1">Available Balance</p>
        <div className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
          ${balance}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between space-x-2 mb-6">
        <button
          onClick={handleAddMoney}
          className="flex-1 flex items-center justify-center bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>Add Money</span>
        </button>

        <button
          onClick={handleWithdraw}
          className="flex-1 flex items-center justify-center bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          <span>Withdraw</span>
        </button>
      </div>

      {/* Track Your Activities Link */}
      <div className="mt-6">
        <Link href="/track-activities">
          <div className="flex items-center space-x-2 text-black hover:text-gray-800 cursor-pointer transition">
            <Activity className="w-5 h-5" />
            <span className="font-bold underline">Track Your Activities</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;
