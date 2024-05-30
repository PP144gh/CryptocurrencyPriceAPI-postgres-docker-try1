import React, { useState, useEffect } from "react";
import "./App.css";
import StartButton from './startButton';

function App() {
  const [data, setData] = useState({
    pair: '',
    fetchInterval: null,
    priceOscillationTrigger: null,
    priceOscillation: null,
    timestamp: '',
    running: true
  });

  // State for the input fields
  const [inputs, setInputs] = useState({
    pair: '',
    fetchInterval: '',
    priceOscillationTrigger: ''
  });

  // State for alerts list
  const [alerts, setAlerts] = useState([]);

  // Update alerts whenever data changes
  useEffect(() => {
    if (data.timestamp !== '') {
      setAlerts(prevAlerts => [
        ...prevAlerts,
        {
          pair: data.pair,
          interval: data.fetchInterval,
          priceOscillation: data.priceOscillation,
          timestamp: data.timestamp
        }
      ]);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleStartButtonClick = () => {
    // Add new line to alerts list
    setAlerts([
      ...alerts,
      {
        pair: inputs.pair,
        interval: inputs.fetchInterval,
        priceOscillation: inputs.priceOscillationTrigger,
        timestamp: data.timestamp
      }
    ]);

    // Clear input fields after adding to alerts list
    setInputs({
      pair: '',
      fetchInterval: '',
      priceOscillationTrigger: ''
    });
  };

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
          <StartButton data={data} updateData={setData} inputs={inputs} onStart={handleStartButtonClick} />
        </div>

        <div className="alertss-table">
          <h2>Alerts List</h2>
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Fetch Interval (ms)</th>
                <th>Price Oscillation (%)</th>
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
