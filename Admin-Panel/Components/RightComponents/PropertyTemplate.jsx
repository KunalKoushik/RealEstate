import React from 'react';

const PropertyTemplate = ({ detail }) => {
  const {
    title,
    description,
    price,
    type,
    location,
    category,
    washrooms,
    bedrooms,
    totalArea,
    images,
    user,
  } = detail;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition duration-300">
      <img
        src={images}
        alt={title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500">Type: {type}</p>
      <p className="text-sm text-gray-500">Location: {location}</p>
      <p className="text-sm text-gray-500">Category: {category}</p>
      <p className="text-sm text-gray-500">Bedrooms: {bedrooms}, Washrooms: {washrooms}</p>
      <p className="text-sm text-gray-500">Area: {totalArea} sq.ft.</p>
      <p className="text-blue-600 font-bold mt-2">₹{Number(price).toLocaleString()}</p>
      <div className="text-xs text-gray-400 mt-2">Owner: {user?.firstName} {user?.lastName}</div>
    </div>
  );
};

export default PropertyTemplate;
