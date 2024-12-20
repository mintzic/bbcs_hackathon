"use client"
import HomeSidebar from "@/components/HomeSidebar";
import CreateCard from "@/components/CreateCard";
import PostsCards from "@/components/PostsCards";
import WalletCard from "@/components/WalletCard";
import TopDonorsCard from "@/components/TopDonorsCard";

const sampleItems = [
  {
    userName: "Alex Johnson",
    userHandle: "alexjohnson",
    userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
    description: "Offering gently used children's books for donation. 📚",
    images: [
      "https://parentsworld.com.sg/wp-content/uploads/2023/02/Caden-n-Caelyns-Trove-11.jpg"
    ],
  },
  {
    userName: "Emily Davis",
    userHandle: "emilydavis",
    userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    description: "Giving away extra kitchenware. Perfect for new homes! 🍽️",
    images: [
      "https://cdn.shopify.com/s/files/1/0358/3511/7703/files/sc7_480x480.jpg?v=1607420011",
    ],
  },
];

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
          <PostsCards data={sampleItems} type="item" />
        </div>
        <div className="w-1/4 overflow-scroll">
          <WalletCard />
          <TopDonorsCard />
        </div>
      </main>
    </>
  );
}
