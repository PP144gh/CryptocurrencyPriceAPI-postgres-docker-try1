const path = require('path');
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');



const PORT = process.env.PORT || 3001;

const app = express();
// Use CORS middleware (this enables CORS for all routes and origins)
//app.use(cors());

// Enable CORS only for http://localhost:3000 (frontend)
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.use(express.json()); // To parse JSON bodies

// Helper function to extract value from the script output
function extractValue(key, output) {
  const regex = new RegExp(`${key}=([^\\s]+)`);
  const match = output.match(regex);
  return match ? match[1] : null;
}

app.post('/start', (req, res) => {
  const { pair, fetchInterval, priceOscillationTrigger } = req.body;

  console.log(req.body)

  if (!pair || !fetchInterval || !priceOscillationTrigger) {
    return res.status(400).send('Missing required fields');
  }

  const command = `node ./backend/scripts/start.js ${pair} ${fetchInterval} ${priceOscillationTrigger}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error executing script');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Script execution returned an error');
    }
    console.log(`stdout: ${stdout}`);
    const priceOscillation = extractValue("PRICE OSCILLATION", stdout);
    const price = extractValue("PRICE", stdout);
    const timestamp = extractValue("TIMESTAMP", stdout);

    const result = {
      pair,
      fetchInterval,
      priceOscillationTrigger,
      priceOscillation: parseFloat(priceOscillation),
      price : parseFloat(price).toFixed(4),
      timestamp
    };
    res.send(result);
  });
});

app.get('/price/:pair', (req, res) => {
  const pair = req.params.pair;

  const command = `node ./backend/scripts/priceAlerts.js ${pair}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error executing script');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Script execution returned an error');
    }
    //console.log(`stdout: ${stdout}`);
    const pair = extractValue("PAIR", stdout);
    const price = extractValue("PRICE", stdout);
    const timestamp = extractValue("TIMESTAMP", stdout);

    const result = {
      pair: pair,
      price: price,
      timestamp: timestamp
    };
    //console.log(result);
    res.send(result);
  })


});


app.get('*', (req, res) => {
  res.status(400).send('Invalid Request')
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

