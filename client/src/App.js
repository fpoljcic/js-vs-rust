import React, { useEffect, useState } from 'react';
import './App.css';

// Ucitavanje svih rijeci engleskog jezika
var wordsJS = [];
var wordsRust = [];
function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        wordsJS = rawFile.responseText.split("\r\n");
        wordsRust = wordsJS
        console.log("Finished reading data.");
      }
    }
  }
  rawFile.send(null);
}
readTextFile("./words_alpha.txt");

// For u64 support add (global BigInt)
// const [rustResult, setRustResult] = useState("");
// let sum = BigInt(wasm.fibonacci(inputValue)).toString();

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

  function runJS(flag) {
    let start = performance.now();
    let result = 0;

    // ------------------------ CODE START ------------------------
    switch (flag) {
      case 0:
        result = fibonacci(inputValue);
        break;
      case 1:
        wordsJS.sort((a, b) => b.localeCompare(a));
        wordsJS = wordsJS.filter((word) => !word.includes("a") && !word.includes("e") && !word.includes("i") && !word.includes("o") && !word.includes("u") && word.length > 6);
        console.log(wordsJS);
        result = "Finished";
        break;
      default:
        return;
    }
    // ------------------------ CODE END ------------------------

    let end = performance.now();
    setJsResult(result);
    let time = end - start;
    setJsTime(time);
  }

  function runRust(flag) {
    setPressed(true);
    let start = performance.now();
    let result = 0;

    // ------------------------ CODE START ------------------------
    switch (flag) {
      case 0:
        result = wasm.fibonacci(inputValue);
        break;
      case 1:
        wordsRust = wasm.words_test(wordsRust);
        console.log(wordsRust);
        result = "Finished";
        break;
      default:
        return;
    }
    // ------------------------ CODE END ------------------------

    let end = performance.now();
    setRustResult(result);
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
      <button onClick={() => runJS(0)} >
        Run JS code (fibonacci)
      </button>
      <button onClick={() => runJS(1)} >
        Run JS code (words)
      </button>
      <h1>
        {rustLoadTime} + {rustTime} ms ({rustResult})
      </h1>
      <button style={pressed ? { backgroundColor: '#3e8e41', boxShadow: '0 5px #666', transform: 'translateY(4px)' } : null} onClick={() => runRust(0)} >
        Run Rust code (fibonacci)
      </button>
      <button style={pressed ? { backgroundColor: '#3e8e41', boxShadow: '0 5px #666', transform: 'translateY(4px)' } : null} onClick={() => runRust(1)} >
        Run Rust code (words)
      </button>
      <h1 style={jsTime < rustTime ? { color: 'red' } : { color: 'green' }}>
        {jsTime >= rustTime ? Math.round(jsTime / (rustTime + rustLoadTime) * 100) / 100 : Math.round((rustTime + rustLoadTime) / jsTime * 100) / 100} times {jsTime >= rustTime ? "faster" : "slower"}
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
