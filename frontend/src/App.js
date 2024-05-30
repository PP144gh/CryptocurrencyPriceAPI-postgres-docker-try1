import React, { useState } from "react";
import "./App.css";
import StartButton from './startButton';

function App() {
  const [data, setData] = useState({
    pair: '',
    fetchInterval: null,
    priceOscillationTrigger: null,
    priceOscillation: null,
    price: null,
    timestamp: ''
  });

// State for the input fields
const [inputs, setInputs] = useState({
  pair: '',
  fetchInterval: '',
  priceOscillationTrigger: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setInputs({
    ...inputs,
    [name]: value
  });
};

  const alerts = [
    { pair: 'fill', interval: 'fill', priceOscillation: 'fill', timestamp: 'fill' },
    { pair: 'fill', interval: 'fill', priceOscillation: 'fill', timestamp: 'fill' },
  ];


  return (
    <div className="App">
      <header className="App-header">
        <div>
          {data && (
            <div>
              <div><strong>Pair:</strong> {data.pair}</div>
            </div>
          )}
        </div>

        <div className="input-row">
          <input
            type="text"
            name="pair"
            placeholder="Pair"
            value={inputs.pair}
            onChange={handleChange}
          />
          <input
            type="number"
            name="fetchInterval"
            placeholder="Fetch Interval (ms)"
            value={inputs.fetchInterval}
            onChange={handleChange}
          />
          <input
            type="number"
            name="priceOscillationTrigger"
            placeholder="Price Oscillation Trigger (%)"
            value={inputs.priceOscillationTrigger}
            onChange={handleChange}
          />
        </div>

        <div className="button-row">
          <StartButton data={data} updateData={setData} inputs={inputs} />
        </div>

        <div className="alertss-table">
          <h2>Alerts List</h2>
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Fetch Interval</th>
                <th>Price Oscillation</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.pair}</td>
                  <td>{alert.interval}</td>
                  <td>{alert.priceOscillation}</td>
                  <td>{alert.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;