import "./App.css";
import React from 'react';
import { useState } from "react";
import Papa from "papaparse";
import rr from './files/Result.csv';
import './OpenCsv.css';
function App() {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const [rows, setRows] = React.useState([])
  React.useEffect(() => {
    async function getData() {
      
      const response = await fetch(rr)
      console.log(response)
      const reader = response.body.getReader()
      const result = await reader.read() // raw array
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) // the csv text
      const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
      const rows = results.data // array of objects
      console.log(rows);
      const rowsArray = [];
      const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
      });
      console.log("output");
      setTableRows(rowsArray[0]);
      setValues(valuesArray);
    }
    getData()
  }, []) 

  // const changeHandler = (event) => {
  //   // Passing file data (event.target.files[0]) to parse using Papa.parse
  //   console.log(event);
  //   Papa.parse(event.target.files[0], {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: function (results) {
  //       const rowsArray = [];
  //       const valuesArray = [];

  //       // Iterating data to get column name and their values
  //       results.data.map((d) => {
  //         rowsArray.push(Object.keys(d));
  //         valuesArray.push(Object.values(d));
  //       });

  //       // Parsed Data Response in array format
  //       setParsedData(results.data);
  //       console.log(results.data);

  //       // Filtered Column Names
  //       setTableRows(rowsArray[0]);

  //       // Filtered Values

  //       setValues(valuesArray);
  //     },
  //   });
  // };
   

  return (
    <div>
      {/* File Uploader */}
      {/* <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      /> */}
      {/* <button onClick={changeCsv}></button> */}
      <br />
      <br />
      {/* Table */}
      <table>
        <thead>
          <tr>
            {tableRows.map((rows, index) => {
              return <th key={index}>{rows}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => {
            return (
              <tr key={index}>
                {value.map((val, i) => {
                  return <td key={i}>{val}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;