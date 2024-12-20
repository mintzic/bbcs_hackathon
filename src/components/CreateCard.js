"use client";

import React, { useState } from "react";
import { ImagePlus, Calendar } from "lucide-react";

const CreateCard = ({ title, showPrice, showDeadline, onSubmit }) => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description, price, deadline, images });
  };

  return (
    <div className="p-6 bg-beige m-3 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description Input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description..."
          className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring focus:ring-black bg-transparent text-black placeholder-black"
          rows="3"
          autoFocus
        />

        {/* Price Input (Conditional) */}
        {showPrice && (
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring focus:ring-black bg-transparent text-black placeholder-black"
          />
        )}

        {/* Deadline Input (Conditional) */}
        {showDeadline && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-black" />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring focus:ring-black bg-transparent text-black"
            />
          </div>
        )}

        {/* Image Upload and Submit Button */}
        <div className="flex items-center justify-between">
          <AddPhotosButton onChange={handleImageUpload} />
          <button
            type="submit"
            className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </div>

        {/* Display Uploaded Images */}
        <UploadedImages images={images} onRemove={handleRemoveImage} />
      </form>
    </div>
  );
};

const AddPhotosButton = ({ onChange }) => (
  <label className="cursor-pointer bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition flex items-center justify-center">
    <ImagePlus className="w-6 h-6" />
    <input type="file" accept="image/*" multiple onChange={onChange} className="hidden" />
  </label>
);

const UploadedImages = ({ images, onRemove }) => (
  <div className="flex flex-wrap mt-4">
    {images.map((image, index) => (
      <div key={index} className="relative w-20 h-20 mr-2 mb-2">
        <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-full h-full object-cover rounded-md" />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          &times;
        </button>
      </div>
    ))}
  </div>
);

export default CreateCard;
