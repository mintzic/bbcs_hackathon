"use client";
import { Button } from "@/components/ui/button";
import HomeSidebar from "@/components/HomeSidebar";
import CreateCard from "@/components/CreateCard";
import PostsCards from "@/components/PostsCards";
import WalletCard from "@/components/WalletCard";
import TopDonorsCard from "@/components/TopDonorsCard";

const sampleEvents = [
  {
    userName: "Alice Brown",
    userHandle: "alicebrown",
    userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
    description: "Join us for a Christmas charity bake sale! 🍪",
    eventDate: "2024-12-20",
    location: "Community Hall, Main Street",
    images: [
       "https://www.ageuk.org.uk/bp-assets/globalassets/milton-keynes/original-blocks/get-involved/fundraising/jingle-bakes-landscape-2.jpg",
      "https://www.spd.org.sg/wp-content/uploads/2021/11/spd-bakery-2021-1000x650.jpg",
    ],
  },
  {
    userName: "Michael Lee",
    userHandle: "michaellee",
    userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    description: "Christmas caroling night – let's spread joy with music! 🎤",
    eventDate: "2024-12-24",
    location: "Central Park",
    images: [
      "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_3414,w_5121,x_0,y_0/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/shutterstock_1570325434_ypqrc8.jpg",
      "https://www.denverpost.com/wp-content/uploads/2018/12/AFP_1BS5W8.jpg?w=1024",
      
    ],
  },
];

export default function Home() {
  const handleEventSubmit = (data) => {
    console.log("Event Submitted:", data);
  };

  return (
    <>
      <main className="bg-cream text-white flex flex-row max-h-screen">
        <HomeSidebar />
        <div className="w-2/4 overflow-scroll p-4">
          <CreateCard
            title="Create an Event"
            showPrice={false}
            showDeadline={true}
            onSubmit={handleEventSubmit}
          />
          <PostsCards data={sampleEvents} type="event" />
        </div>
        <div className="w-1/4 overflow-scroll p-4">
          <WalletCard />
          <TopDonorsCard />
        </div>
      </main>
    </>
  );
}
