"use client"
import { Button } from "@/components/ui/button";
import HomeSidebar from "@/components/HomeSidebar";
import CreateCard from "@/components/CreateCard";
import Wishes from "@/components/Wishes";
import WalletCard from "@/components/WalletCard";
import TopDonorsCard from "@/components/TopDonorsCard";



export default function Home() {
  const handleWishSubmit = (data) => {
    console.log("Wish Submitted:", data);
  };

  return (
    <>
      <main className="bg-cream text-white flex flex-row max-h-screen">
        <HomeSidebar />
        <div className="w-2/4 overflow-scroll">
          <CreateCard
            title="Donate an item"
            showPrice={false}
            showDeadline={false}
            onSubmit={handleWishSubmit}
          />
          <Wishes />
        </div>
        <div className="w-1/4 overflow-scroll">
          <WalletCard />
          <TopDonorsCard />
        </div>
      </main>
    </>
  );
}
