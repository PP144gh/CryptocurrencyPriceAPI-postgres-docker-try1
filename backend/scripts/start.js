const axios = require('axios');

const [,, pair, fetchInterval, priceOscillationTrigger] = process.argv;


let oldPrice = 0;
let newPrice = 0;
let priceChange = 0.0;
let alert = false;


console.log(pair)
console.log(fetchInterval)
console.log(priceOscillationTrigger)
const apiURL = `http://localhost:3001/price/${pair}`;

const fetchPrice = async () => {
  try {
    const response = await axios.get(apiURL);
    return response.price;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
};

const monitorPrice = async () => {
  while (true) {
    if (oldPrice === 0) {
      oldPrice = await fetchPrice();
    } else {
      await new Promise(resolve => setTimeout(resolve, fetchInterval)); 
      newPrice = await fetchPrice();

      if (newPrice !== null) {
        const changePercent = ((newPrice - oldPrice) / oldPrice) * 100;

        if (Math.abs(changePercent) >= priceOscillationTrigger) {
          priceChange = changePercent;
          alert = true;
          console.log(`Price changed by ${priceChange.toFixed(2)}%. Alert set to ${alert}.`);
        }

        oldPrice = newPrice;
      }
    }
  }
};

monitorPrice();
