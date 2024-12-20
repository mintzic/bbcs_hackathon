"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Gift, DollarSign, Send, CalendarCheck } from "lucide-react";

const PostsCards = ({ data, type }) => {
  const [showRequestBox, setShowRequestBox] = useState(false);
  const [requestText, setRequestText] = useState("");

  const handleRequestClick = () => {
    setShowRequestBox(!showRequestBox);
  };

  return (
    <div className="m-3">
      {data.map((item, index) => (
        <div key={index} className="bg-beige text-black p-6 py-8 mb-3 rounded-lg shadow-md">
          {/* Profile Section */}
          <div className="flex items-center mb-4">
            <img
              src={item.userAvatar}
              alt={item.userName}
              className="w-12 h-12 rounded-full mr-3 border-2 border-black"
            />
            <div>
              <p className="font-bold text-lg">{item.userName}</p>
              <p className="text-sm text-gray-700">@{item.userHandle}</p>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4">{item.description}</p>

          {/* Image Carousel */}
          {item.images && item.images.length > 0 && (
            <Swiper
              modules={[Navigation]}
              navigation
              className="rounded-lg overflow-hidden mb-4"
            >
              {item.images.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={image}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Progress Bar and Buttons for Wish */}
          {type === "wish" && (
            <>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">
                    ${item.currentAmount} raised of ${item.goalAmount}
                  </span>
                  <span className="text-sm text-gray-700">
                    {Math.min((item.currentAmount / item.goalAmount) * 100, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black"
                    style={{
                      width: `${Math.min((item.currentAmount / item.goalAmount) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons for Wish */}
              <div className="flex justify-between">
                <button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition">
                  <Gift className="w-5 h-5" />
                  <span>Buy Gift</span>
                </button>
                <button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition">
                  <DollarSign className="w-5 h-5" />
                  <span>Donate</span>
                </button>
              </div>
            </>
          )}

          {/* Request Button and Textarea for Item */}
          {type === "item" && (
            <div className="flex flex-col">
              <button
                onClick={handleRequestClick}
                className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition mb-3"
              >
                <Send className="w-5 h-5" />
                <span>Request</span>
              </button>
              {showRequestBox && (
                <textarea
                  className="w-full p-2 bg-gray-200 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  rows="3"
                  placeholder="Write your request here..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Join Button for Event */}
          {type === "event" && (
            <div className="flex justify-between">
              <button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition">
                <CalendarCheck className="w-5 h-5" />
                <span>Join Event</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsCards;
