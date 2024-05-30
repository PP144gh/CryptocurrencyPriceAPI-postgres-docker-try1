import React from 'react';

function StartButton({ updateData, inputs }) { 

  console.log(JSON.stringify(inputs))

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/start', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs) 
      });

      const responseData = await response.json();

      updateData(prevData => ({
        ...prevData,
        pair: responseData.pair,
        fetchInterval: responseData.fetchInterval,
        priceOscillationTrigger: responseData.priceOscillationTrigger,
        priceOscillation: responseData.priceOscillation,
        price: responseData.price,
        timestamp: responseData.timestamp
      }));

      console.log(responseData);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Start</button>
    </div>
  );
}

export default StartButton;
