import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    pair: "",
    fetchInterval: null,
    priceOscillationTrigger: null,
    priceOscillation: null,
    price: null,
    timestamp: "",
    running: false,
  });

  const [inputs, setInputs] = useState({
    pair: "",
    fetchInterval: "",
    priceOscillationTrigger: "",
  });

  const [alerts, setAlerts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (data.running && data.timestamp !== "" && (alerts.length === 0 || alerts[alerts.length - 1].timestamp !== data.timestamp)) {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          pair: data.pair,
          interval: data.fetchInterval,
          priceOscillation: data.priceOscillation,
          priceOscillationTrigger: data.priceOscillationTrigger,
          price: data.price,
          timestamp: data.timestamp,
        },
      ]);
    }
  }, [data, alerts]);

const handleChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  // Input validation based on the input name
  switch (name) {
    case "pair":
      // Allow only letters and hyphens in pair input
      newValue = value.replace(/[^a-zA-Z-]/g, "");
      break;
    case "fetchInterval":
    case "priceOscillationTrigger":
    // Allow only numbers (0-9) and dot (.) in fetchInterval and priceOscillationTrigger inputs
    newValue = value.replace(/[^\d.]/g, "");

      break;
    default:
      break;
  }

  // Update the state with the validated value
  setInputs({
    ...inputs,
    [name]: newValue,
  });
};


  const handleStartButtonClick = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error("Failed to start: " + response.statusText);
      }

      const responseData = await response.json();

      setData((prevData) => ({
        ...prevData,
        pair: responseData.pair,
        fetchInterval: responseData.fetchInterval,
        priceOscillationTrigger: responseData.priceOscillationTrigger,
        priceOscillation: responseData.priceOscillation,
        price: responseData.price,
        timestamp: responseData.timestamp,
      }));

      console.log(responseData);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [inputs]);

  useEffect(() => {
    if (data.running && data.timestamp !== "") {
      handleStartButtonClick();
    }
  }, [data.timestamp, data.running, handleStartButtonClick]);

  const startLoop = () => {
    setData((prevData) => ({
      ...prevData,
      running: true,
    }));
    handleStartButtonClick();
  };

  const handleStopButtonClick = () => {
    setData((prevData) => ({
      ...prevData,
      running: false,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {data && (
            <div>
              <div>
                <strong>Pair:</strong> {data.pair}
              </div>
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
          <button onClick={startLoop} disabled={data.running}>
            Start
          </button>
          <button onClick={handleStopButtonClick} disabled={!data.running}>
            Stop
          </button>
        </div>

        <div className="alerts-table">
          <h2>Alerts List</h2>
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Fetch Interval (ms)</th>
                <th>Price Oscillation (%)</th>
                <th>Price Oscillation Trigger (%)</th>
                <th>Price (USD)</th>
                <th>Timestamp (ISO)</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.pair}</td>
                  <td>{alert.interval}</td>
                  <td>{alert.priceOscillation}</td>
                  <td>{alert.priceOscillationTrigger}</td>
                  <td>{alert.price}</td>
                  <td>{alert.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errorMessage && (
          <div className="error-window">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
