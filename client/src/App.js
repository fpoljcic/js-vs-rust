import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [jsTime, setJsTime] = useState(0);
  const [rustTime, setRustTime] = useState(0);
  const [rustLoadTime, setRustLoadTime] = useState(0);
  const [jsResult, setJsResult] = useState(0);
  const [rustResult, setRustResult] = useState("");
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

  function runBenchmark() {
    let resultJS = [];
    let resultRust = [];
    let start1, sum1, end1, time1;
    let start2, sum2, end2, time2;
    for (let i = 1; i <= inputValue; i++) {
      // JS
      start1 = performance.now();
      sum1 = fibonacci(i);
      end1 = performance.now();
      time1 = end1 - start1;

      // RUST
      start2 = performance.now();
      sum2 = wasm.fibonacci(i);
      end2 = performance.now();
      time2 = end2 - start2;

      resultJS.push(time1);
      resultRust.push(time2);
      console.log(i + ".run: JS - " + time1 + " ms (" + sum1 + ")   |   Rust -  " + time2 + " ms (" + sum2 + ")");
    }
    console.log("JS result: " + resultJS);
    console.log("Rust result: " + resultRust);
  }

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
    // For u64 support add (global BigInt)
    // const [rustResult, setRustResult] = useState("");
    // let sum = BigInt(wasm.fibonacci(inputValue)).toString();
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
    const wasm = await import('rust-helper');
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
      <button style={{ marginLeft: '40px', marginBottom: '100px' }} onClick={runBenchmark} >
        Run benchmark (console)
      </button>
    </div>
  );
}

export default App;
