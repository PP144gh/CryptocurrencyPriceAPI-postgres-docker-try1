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


const extractValue = (key, string) => {
  const regex = new RegExp(`${key}="([^"]+)"`);
  const match = string.match(regex);
  return match ? match[1] : null;
};




// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

//go to http://localhost:3001/api, should see
/* {
"message": "Hello from server!"
}
*/

app.get('/createAccount', (req, res) => {
  exec('yarn ts-node ./backend/scripts/attester/generateAccount.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error executing script');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Script execution returned an error');
    }
    console.log(`stdout: ${stdout}`);
    const mnemonic = extractValue("ATTESTER_ACCOUNT_MNEMONIC", stdout);
    const address = extractValue("ATTESTER_ACCOUNT_ADDRESS", stdout);

      // Add a balance field with value 0 to the data object, new account so balance is always 0
    const balance = 0;

    const result = JSON.stringify({ mnemonic, address, balance}, null, 2);
    console.log(result);
    res.send(result); // Send the output of the script to the client
  })
});



app.post('/registerDID', (req, res) => {
  const address = req.query.address;
  const mnemonic = req.body.mnemonic;
  if (!mnemonic || typeof mnemonic !== 'string') {
    res.status(400).send('Mnemonic is required');
    return;
  }

  const execPromise = (command) => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject('Error executing command');
      } else {
        resolve(stderr + stdout); // Combine both stderr and stdout
      }
    });
  });

  execPromise(`yarn ts-node ./backend/scripts/attester/generateDid.ts "${mnemonic}" ${address}`)
    .then(output => {
      console.log(output);
      const outputLines = output.trim().split('\n');
      let didUri, balance, attesterDidMnemonic;

      outputLines.forEach(line => {
        if (line.includes('ATTESTER_DID_URI')) {
          didUri = line.split('"')[1]; // Assuming the URI is enclosed in quotes
        } else if (line.includes('Balance for')) {
          balance = line.split(':').pop().trim();
        } else if (line.includes('ATTESTER_DID_MNEMONIC=')) {
          attesterDidMnemonic = line.split('ATTESTER_DID_MNEMONIC=')[1].trim(); // Extracting the mnemonic
        }
      });

      if (!didUri) {
        throw new Error('DID URI not found');
      }

      res.json({
        DIDmnemonic: attesterDidMnemonic, // Using the extracted mnemonic here
        DIDuri: didUri,
        balance: balance
      });
    })
    .catch(errorMessage => {
      res.status(500).send(errorMessage);
    });
});


app.get('*', (req, res) => {
  res.status(400).send('Invalid Request')
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

