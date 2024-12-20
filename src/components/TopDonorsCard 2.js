import React from "react";
import { Medal } from "lucide-react";

const TopDonorsCard = () => {
  const donors = [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      amount: 500,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      amount: 450,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Alice Johnson",
      email: "alicejohnson@example.com",
      amount: 400,
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "Robert Brown",
      email: "robertbrown@example.com",
      amount: 350,
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      amount: 300,
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
  ];

  return (
    <div className="bg-beige text-black p-6 m-3 rounded-lg shadow-md">
      {/* Card Header */}
      <div className="flex items-center mb-4">
        <Medal className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold">Top 5 Donors of the Month</h2>
      </div>

      {/* Donors List */}
      <ul className="space-y-4">
        {donors.map((donor, index) => (
          <li
            key={index}
            className="flex items-center justify-between border border-black p-3 rounded-md hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <img
                src={donor.avatar}
                alt={donor.name}
                className="w-12 h-12 rounded-full mr-3 border-2 border-yellow-500"
              />
              <div>
                <p className="font-bold">{donor.name}</p>
                <p className="text-sm text-gray-700">{donor.email}</p>
              </div>
            </div>
            <span className="text-black font-semibold">${donor.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopDonorsCard;
