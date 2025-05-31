import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyProperty = ({ propertyId }) => {
  const navigate = useNavigate();
  const [isBuying, setIsBuying] = useState(false); // Track purchase status
  const [errorMessage, setErrorMessage] = useState(null); // Track error messages

  const buyProperty = async () => {
    setIsBuying(true); // Start the buying process (could show loading indicator)
    setErrorMessage(null); // Reset any previous error messages

    try {
      const token = localStorage.getItem('token');
      console.log("first:", token);
      const response = await axios.post(
        `http://localhost:4000/api/v1/property/buy/${propertyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert('Property purchase initiated!');
      navigate('/properties');
    } catch (error) {
      console.error('Error buying property:', error);
      setErrorMessage('Failed to buy property.');
    } finally {
      setIsBuying(false); // Reset buying status after the operation
    }
  };

  return (
    <div>
      <button onClick={buyProperty} disabled={isBuying}>
        {isBuying ? 'Processing...' : 'Buy Property'}
      </button>
      {errorMessage && <p>{errorMessage}</p>} {/* Show error message if exists */}
    </div>
  );
};

export default BuyProperty;
