import React, { useEffect, useState } from 'react';
import PropertyTemplate from './PropertyTemplate';
import axios from 'axios';

const Properties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/admin/properties');
      
        setProperties(response.data);
      
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {properties.map((property) => (
        <PropertyTemplate key={property._id} detail={property} />
      ))}
    </div>
  );
};

export default Properties;
