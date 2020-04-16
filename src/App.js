import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [jsTime, setJsTime] = useState(0);
  const [rustTime, setRustTime] = useState(0);
  const [rustLoadTime, setRustLoadTime] = useState(0);
  const [jsResult, setJsResult] = useState(0);
  const [rustResult, setRustResult] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [wasm, setWasm] = useState(null);
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    let start = performance.now();
    loadWasm();
    let end = performance.now();
    let time = end - start;
    setRustLoadTime(time);
  }, []);

  function fibonacci(num) {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  function runJS() {
    let start = performance.now();

    // ------------------------ CODE START ------------------------
    let sum = fibonacci(inputValue);
    // ------------------------ CODE END ------------------------

    let end = performance.now();
    setJsResult(sum);
    let time = end - start;
    setJsTime(time);
  }

  function runRust() {
    setPressed(true);
    let start = performance.now();

    // ------------------------ CODE START ------------------------
    let sum = wasm.fibonacci(inputValue);
    // ------------------------ CODE END ------------------------

    let end = performance.now();
    setRustResult(sum);
    setPressed(false);
    let time = end - start;
    setRustTime(time);
  }

  const loadWasm = async () => {
    const wasm = await import('@fpoljcic/rust-helper');
    setWasm(wasm);
  };

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  return (
    <div className="App" >
      <h1 style={{ marginTop: '40px' }}>
        {jsTime} ms ({jsResult})
      </h1>
      <button onClick={runJS} >
        Run JS code
      </button>
      <h1>
        {rustLoadTime} + {rustTime} ms ({rustResult})
      </h1>
      <button style={pressed ? { backgroundColor: '#3e8e41', boxShadow: '0 5px #666', transform: 'translateY(4px)' } : null} onClick={runRust} >
        Run Rust code
      </button>
      <h1 style={{ color: 'green' }}>
        {Math.round(jsTime / (rustTime + rustLoadTime) * 100) / 100} times faster
      </h1>
      <label>
        Unesite broj:
      </label>
      <input maxLength="3" placeholder="F(n)" type="text" onChange={handleChange} />
    </div>
  );
}

export default App;
