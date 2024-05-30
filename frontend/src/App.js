import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    pair: '',
    fetchInterval: null,
    priceOscillationTrigger: null,
    priceOscillation: null,
    price: null,
    timestamp: '',
    running: false
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
          price: data.price,
          timestamp: data.timestamp
        }
      ]);
    }
  }, [data]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  // Handle start button click
  const handleStartButtonClick = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      });

      const responseData = await response.json();

      setData(prevData => ({
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
  }, [inputs]);

  // Handle automatic restart
  useEffect(() => {
    if (data.running && data.timestamp !== '') {
      handleStartButtonClick();
    }
  }, [data.timestamp, data.running, handleStartButtonClick]);

  // Handle start button click to start the loop
  const startLoop = () => {
    setData(prevData => ({
      ...prevData,
      running: true
    }));
    handleStartButtonClick();
  };

  // Handle stop button click
  const handleStopButtonClick = () => {
    setData(prevData => ({
      ...prevData,
      running: false
    }));
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
          <button onClick={startLoop} disabled={data.running}>Start</button>
          <button onClick={handleStopButtonClick} disabled={!data.running}>Stop</button>
        </div>

        <div className="alertss-table">
          <h2>Alerts List</h2>
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Fetch Interval (ms)</th>
                <th>Price Oscillation (%)</th>
                <th>Price</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.pair}</td>
                  <td>{alert.interval}</td>
                  <td>{alert.priceOscillation}</td>
                  <td>{alert.price}</td>
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
