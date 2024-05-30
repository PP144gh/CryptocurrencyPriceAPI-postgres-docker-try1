import React from 'react';

function StartButton({ updateData }) { // Accept updateData as a prop

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/createAccount');
      let responseData = await response.json();

    

      updateData(prevData => ({
        ...prevData,
        mnemonic: responseData.mnemonic,
        address: responseData.address,
        balance: responseData.balance,
        DIDmnemonic: '',
        DIDuri: ''
      })); // Update mnemonic, address, and balance in the data
      
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
