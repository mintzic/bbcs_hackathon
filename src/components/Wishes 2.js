import PostsCards from "@/components/WishCard";

const sampleData = [
  {
    userName: "John Doe",
    userHandle: "johndoe",
    userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    description: "Wishing for a new gaming console this Christmas! 🎮",
    goalAmount: 500,
    currentAmount: 150,
    images: [
      "https://via.placeholder.com/600x400?text=Gaming+Console+1",
      "https://via.placeholder.com/600x400?text=Gaming+Console+2",
    ],
  },
  {
    userName: "Jane Smith",
    userHandle: "janesmith",
    userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    description: "Hoping to get a new bicycle for my birthday! 🚴‍♀️",
    goalAmount: 300,
    currentAmount: 100,
    images: [
      "https://via.placeholder.com/600x400?text=Bicycle+1",
      "https://via.placeholder.com/600x400?text=Bicycle+2",
    ],
  },
];

export default function Wishes() {
  return (
    <div className="">
      <PostsCards data={sampleData} type="wish" />
    </div>
  );
}
