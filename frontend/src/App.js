import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import './App.css';
import DownloadExcel from './DownloadExcel';
import sampleData from './SampleData';
import sampleIdenticalData from './SampleIdenticalData';
import { Row, Col, Button, Space, Input, Tooltip, Checkbox } from 'antd';
import { Bar, defaults, Line } from 'react-chartjs-2';
import 'antd/dist/antd.css';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

defaults.global.defaultFontSize = 16;
defaults.global.defaultFontColor = 'rgba(0, 0, 0, 0.65)';

// Ucitavanje svih rijeci engleskog jezika
var words = [];
const readTextFile = (file) => {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        words = rawFile.responseText.split("\r\n");
      }
    }
  }
  rawFile.send();
}
readTextFile("https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt");

// For u64 support add (global BigInt)
// const [rustResult, setRustResult] = useState("");
// let sum = BigInt(wasm.fibonacci(inputValue)).toString();

function App() {
  const [wasmDemo, setWasmDemo] = useState(null);
  const [wasmExcel, setWasmExcel] = useState(null);

  const [jsTime, setJsTime] = useState(0);
  const [rustTime, setRustTime] = useState(0);

  const [jsResult, setJsResult] = useState("");
  const [rustResult, setRustResult] = useState("");

  const [inputValue, setInputValue] = useState(0);
  const [checked, setChecked] = useState(false);

  const [page, setPage] = useState(0);

  const testTitles = [
    "Count test",
    "Prime test",
    "Fibonacci test",
    "Fibonacci benchmark",
    "Sort & filter words",
    "Excel export",
  ];

  const testDesc = [
    "Counting to 1 000 000 000 and back using a for loop, but Rust does it 50 000 000 times",
    "Checks how many prime numbers are there till a 1 000 000",
    "Calculates the n-th fibonacci number using recursion",
    "Calculates the first n fibonacci numbers using recursion",
    "Sorts a list of all English words backwards and then filters words longer than 6 that don't include vowels",
    "Exports an excel file with 7500 rows",
  ];

  const JSCode = [
    "function count() {\n    let res = 0;\n      for (let j = 0; j < 1000000000; j++) { res = res + 1; }\n      for (let j = 0; j < 1000000000; j++) { res = res - 1; }\n    return res;\n}",
    "function countPrimes() {\n    let count = 0;\n    for (let i = 0; i < 1000000; i++) if (isPrime(i)) count = count + 1;\n    return count;\n}\nfunction isPrime(num) {\n    let limit = Math.sqrt(num);\n    for (let i = 2; i <= limit; i++) if (num % i === 0) return false;\n    return num > 1;\n}",
    "function fibonacci(num) {\n    if (num <= 1) return 1;\n    return fibonacci(num - 1) + fibonacci(num - 2);\n}",
    "for (let i = 1; i <= enteredValue; i++) {\n      let start = performance.now();\n      resultArray.push(fibonacci(i)); // JS fibonacci call \n      let end = performance.now();\n      timeArray.push(end - start);\n}",
    "function wordsFilter(words) {\n    words.sort((a, b) => b.localeCompare(a));\n    return words.filter((word) => !word.includes(\"a\") && !word.includes(\"e\") && !word.includes(\"i\") && !word.includes(\"o\") && !word.includes(\"u\") && word.length > 6);\n}",
    "    const ExcelFile = ReactExport.ExcelFile;\n    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;\n    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;\n    const DownloadExcel = (props) => {\n        return (\n            <ExcelFile filename={props.filename}>\n                <ExcelSheet data={props.data} name=\"Report\">\n                    <ExcelColumn label=\"id\" value=\"id\" />\n                    <ExcelColumn label=\"guid\" value=\"guid\" />\n                    <ExcelColumn label=\"balance\" value=\"balance\" />\n                    <ExcelColumn label=\"eyeColor\" value=\"eyeColor\" />\n                    <ExcelColumn label=\"name\" value=\"name\" />\n                    <ExcelColumn label=\"gender\" value=\"gender\" />\n                    <ExcelColumn label=\"company\" value=\"compay\" />\n                    <ExcelColumn label=\"email\" value=\"email\" />\n                    <ExcelColumn label=\"phone\" value=\"phone\" />\n                    <ExcelColumn label=\"address\" value=\"address\" />\n                    <ExcelColumn label=\"about\" value=\"about\" />\n                </ExcelSheet>\n            </ExcelFile>\n        );\n    }\n    export default DownloadExcel;",
  ];

  const rustCode = [
    "pub fn count() -> u32 {\n    let mut res: u32 = 0;\n    for _i in 0..50000000 {\n        for _j in 0..1000000000 { res = res + 1; }\n        for _j in 0..1000000000 { res = res - 1; }\n    }\n    res\n}",
    "pub fn countPrimes() -> u32 {\n    let mut count: u32 = 0;\n    for i in 0..1000000 { if isPrime(&i) { count = count + 1; } }\n    return count;\n}\npub fn isPrime(num: &u32) -> bool {\n    let limit = ((*num as f32).sqrt() + 1.0) as u32;\n    for i in 2..limit { if *num % i == 0 { return false; } }\n    *num > 1\n}",
    "fn fibonacci(num: u16) -> u32 {\n    if num <= 1 {\n        1\n    } else {\n        fibon(num - 1) + fibon(num - 2)\n    }\n}",
    "for (let i = 1; i <= enteredValue; i++) {\n      let start = performance.now();\n      resultArray.push(wasmDemo.fibonacci(i)); // Rust fibonacci call \n      let end = performance.now();\n      timeArray.push(end - start);\n}",
    "pub fn wordsFilter(words: &JsValue) -> Array {\n  let mut elements: Vec<String> = words.into_serde().unwrap();\n\n  elements.sort_by(|a, b| b.cmp(&a));\n  elements.retain(|a| !a.contains(\"a\") && !a.contains(\"e\") && !a.contains(\"i\") && !a.contains(\"o\") && !a.contains(\"u\") && a.len() > 6);\n\n  elements.into_iter().map(JsValue::from).collect()\n}",
    "pub fn excelTest(data: &JsValue) -> Vec<u8> {\n    let data: Vec<TestStruct> = data.into_serde().unwrap();\n    let mut wb = Workbook::create_in_memory();\n    let mut sheet = wb.create_sheet(\"Report\");\n\n    wb.write_sheet(&mut sheet, |sheet_writer| {\n        let sw = sheet_writer;\n        sw.append_row(row![\n            \"id\", \"guid\", \"balance\", \"eyeColor\", \"name\", \"gender\", \"company\", \"email\", \"phone\", \"address\", \"about\"\n        ]);\n\n        for e in data {\n            sw.append_row(row![\n                e.id, e.guid, e.balance, e.eyeColor, e.name, e.gender, e.company, e.email, e.phone, e.address, e.about\n            ]);\n        }\n        Ok(())\n    });\n\n    wb.close().ok().unwrap().unwrap()\n}",
  ];

  useEffect(() => {
    loadWasm();
  }, []);

  function fibonacci(num) {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  function wordsFilter(words) {
    words.sort((a, b) => b.localeCompare(a));
    return words.filter((word) => !word.includes("a") && !word.includes("e") && !word.includes("i") && !word.includes("o") && !word.includes("u") && word.length > 6);
  }

  function count() {
    let res = 0;
    for (let j = 0; j < 1000000000; j++) {
      res = res + 1;
    }
    for (let j = 0; j < 1000000000; j++) {
      res = res - 1;
    }
    return res;
  }

  function isPrime(num) {
    let limit = Math.sqrt(num);
    for (let i = 2; i <= limit; i++)
      if (num % i === 0) return false;
    return num > 1;
  }

  function countPrimes() {
    let count = 0;
    for (let i = 0; i < 1000000; i++) {
      if (isPrime(i))
        count = count + 1;
    }
    return count;
  }

  const runJS = (page) => {
    let start = performance.now();
    let result = null;

    switch (page) {
      case 0:
        result = count();
        break;
      case 1:
        result = countPrimes();
        break;
      case 2:
        if (inputValue <= 45)
          result = fibonacci(inputValue);
        break;
      case 3:
        let resultArray = [];
        let timeArray = [];
        for (let i = 1; i <= inputValue; i++) {
          let start = performance.now();
          resultArray.push(fibonacci(i));
          let end = performance.now();
          timeArray.push(end - start);
        }
        setJsTime(timeArray);
        setJsResult(resultArray);
        return;
      case 4:
        result = wordsFilter(Array.prototype.slice.call(words));
        break;
      default:
        return;
    }

    let end = performance.now();
    let time = end - start;
    setJsTime(time);
    setJsResult(result);
  }

  const runRust = (page) => {
    let start = performance.now();
    let result = null;
    switch (page) {
      case 0:
        result = wasmDemo.count();
        break;
      case 1:
        result = wasmDemo.countPrimes();
        break;
      case 2:
        if (inputValue <= 45)
          result = wasmDemo.fibonacci(inputValue);
        break;
      case 3:
        let resultArray = [];
        let timeArray = [];
        for (let i = 1; i <= inputValue; i++) {
          let start = performance.now();
          resultArray.push(wasmDemo.fibonacci(i));
          let end = performance.now();
          timeArray.push(end - start);
        }
        setRustTime(timeArray);
        setRustResult(resultArray);
        return;
      case 4:
        result = wasmDemo.wordsFilter(Array.prototype.slice.call(words));
        break;
      default:
        return;
    }

    let end = performance.now();
    let time = end - start;
    setRustTime(time);
    setRustResult(result);
  }

  const runBoth = (page) => {
    runJS(page);
    runRust(page);
  }

  const loadWasm = async () => {
    const wasmDemo = await import('rust-demo');
    const wasmExcel = await import('simple-excel-writer-wasm');
    setWasmExcel(wasmExcel);
    setWasmDemo(wasmDemo);
  };

  const exportExcel = () => {
    let data;
    if (checked)
      data = wasmExcel.excelTest(sampleIdenticalData);
    else
      data = wasmExcel.excelTest(sampleData);
    var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "excelRust.xlsx");
  }

  const barData = {
    labels: ['JS vs Rust'],
    datasets: [
      {
        label: 'JS',
        backgroundColor: 'rgba(24,144,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(16,100,178,0.8)',
        hoverBorderColor: 'rgba(16,100,178,1)',
        data: [jsTime]
      },
      {
        label: 'Rust',
        backgroundColor: 'rgba(255, 135, 24,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 135, 24,0.8)',
        hoverBorderColor: 'rgba(255, 135, 24,1)',
        data: [rustTime]
      }
    ]
  };

  const lineData = {
    labels: Array.from(Array(jsTime.length), (_, i) => i + 1),
    datasets: [
      {
        label: 'JS',
        backgroundColor: 'rgba(24,144,255,1)',
        borderColor: 'rgba(24,144,255,1)',
        pointHoverBackgroundColor: 'rgba(16,100,178,0.8)',
        pointHoverBorderColor: 'rgba(16,100,178,1)',
        data: jsTime,
        fill: false,
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10
      }, {
        type: 'line',
        label: 'Rust',
        backgroundColor: 'rgba(255, 135, 24,1)',
        borderColor: 'rgba(255, 135, 24,1)',
        pointHoverBackgroundColor: 'rgba(255, 135, 24,0.8)',
        pointHoverBorderColor: 'rgba(255, 135, 24,1)',
        data: rustTime,
        fill: false,
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10
      }
    ]
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            padding: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'ms',
            fontSize: 18
          }
        }
      ]
    }
  };

  const renderChart = (page) => {
    return page === 3 ? (
      <Line data={lineData} options={options} />
    ) : (
        <Bar data={barData} options={options} />
      );
  }

  return (
    <div className="app">
      <Row align="middle" >
        <Col span={24}>
          <div className="test-title">
            {testTitles[page]}
          </div>
          <div className="test-desc">
            {testDesc[page]}
          </div>
        </Col>
      </Row>
      {page === testTitles.length - 1 ? (
        <>
          <Row align="middle">
            <Col span={1}>
              {page !== 0 ?
                <Tooltip title="Previous test">
                  <LeftOutlined className="full-screen-arrow-button-left" onClick={() => {
                    setJsTime(0);
                    setRustTime(0);
                    setJsResult("");
                    setRustResult("");
                    setPage(page - 1);
                  }} />
                </Tooltip>
                : null}
            </Col>
            <Col span={11} className="test-column">
              JavaScript library ({<a target="_blank" rel="noopener noreferrer" href="https://github.com/securedeveloper/react-data-export">react-data-export</a>})
              <div className="code-container">
                {JSCode[page]}
              </div>
            </Col>
            <Col span={11} className="test-column">
              Rust library ({<a target="_blank" rel="noopener noreferrer" href="https://github.com/outersky/simple_excel_writer">simple_excel_writer</a>})
              <div className="code-container">
                {rustCode[page]}
              </div>
            </Col>
            <Col span={1}>
              {page !== testTitles.length - 1 ?
                <Tooltip title="Next test">
                  <RightOutlined className="full-screen-arrow-button-right" onClick={() => {
                    setJsTime(0);
                    setRustTime(0);
                    setJsResult("");
                    setRustResult("");
                    setPage(page + 1);
                  }} />
                </Tooltip> : null}
            </Col>
          </Row>
          <Row style={{ marginBottom: '60px' }}>
            <Col span={24}>
              <Space style={{ paddingLeft: 122 }}>
                <DownloadExcel data={checked ? sampleIdenticalData : sampleData} filename="excelJS" />
                <Button style={{ width: 250 }} size="large" type="primary" onClick={() => exportExcel()}>
                  Export excel file (Rust)
                </Button>
                <Checkbox onChange={(e) => setChecked(e.target.checked)}>Identical rows</Checkbox>
              </Space>
            </Col>
          </Row>
        </>
      ) : (
          <>
            <Row align="top" >
              <Col span={1}>
                {page !== 0 ?
                  <Tooltip title="Previous test">
                    <LeftOutlined className="full-screen-arrow-button-left" onClick={() => {
                      setJsTime(0);
                      setRustTime(0);
                      setJsResult("");
                      setRustResult("");
                      setPage(page - 1);
                    }} />
                  </Tooltip>
                  : null}
              </Col>
              <Col span={11} className="test-column">
                JavaScript code
          <br />
                <div className="code-container">
                  {JSCode[page]}
                </div>
                <br />
          Rust code
          <br />
                <div className="code-container">
                  {rustCode[page]}
                </div>
              </Col>
              <Col span={11}>
                {renderChart(page)}
              </Col>
              <Col span={1}>
                {page !== testTitles.length - 1 ?
                  <Tooltip title="Next test">
                    <RightOutlined className="full-screen-arrow-button-right" onClick={() => {
                      setJsTime(0);
                      setRustTime(0);
                      setJsResult("");
                      setRustResult("");
                      setPage(page + 1);
                    }} />
                  </Tooltip> : null}
              </Col>
            </Row>
            <Row style={{ marginBottom: '60px' }} align="middle" >
              <Col span={1}>
              </Col>
              <Col span={11}>
                <Space style={{ float: 'left' }}>
                  {page === 2 || page === 3 ?
                    <Input size="large" style={{ textAlign: 'center', width: 200 }} placeholder="Enter number (<= 45)" maxLength={2} onChange={(e) => setInputValue(e.target.value)} />
                    : null}
                  <Button style={{ width: 150 }} size="large" type="primary" onClick={() => runJS(page)}>
                    Run JS code
                  </Button>
                  <Button style={{ width: 150 }} size="large" type="primary" onClick={() => runRust(page)}>
                    Run Rust code
                  </Button>
                </Space>
                <Space style={{ float: 'right' }}>
                  <Button style={{ marginLeft: '40px', width: 150 }} size="large" type="primary" onClick={() => runBoth(page)}>
                    Run both
            </Button>
                </Space>
              </Col>
              <Col span={11}>
                <span style={{ marginLeft: 76 }}>
                  <Input size="large" style={{ width: '40%', textAlign: 'center', margin: '10px' }} placeholder="JS result" value={jsResult} />
                  <Input size="large" style={{ width: '40%', textAlign: 'center', margin: '10px' }} placeholder="Rust result" value={rustResult} />
                </span>
              </Col>
              <Col span={1}>
              </Col>
            </Row>
          </>
        )
      }
      <div className="footer-div">
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/fpoljcic/js-vs-rust">Github</a> |
        <a target="_blank" rel="noopener noreferrer" href="mailto:fpoljcic1@etf.unsa.ba"> Contact</a>
        <div style={{ marginTop: '-25px', textAlign: 'right', paddingRight: '40px' }}>
          Made by<a target="_blank" rel="noopener noreferrer" href="https://github.com/fpoljcic"> Faris Poljčić</a>
        </div>
      </div>
    </div >
  );
}

export default App;
