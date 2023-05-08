import "./App.css";
import React from 'react';
import { useState } from "react";
import Papa from "papaparse";
import car1 from './files/cars1.csv';
import car2 from './files/cars2.csv';
import car7 from './files/cars7.csv';

import { useParams } from 'react-router-dom';

import './OpenCsv.css';

function App() {
  // State to store parsed data
  const { fileName } = useParams();
  console.log("inside the csv " +fileName)


 


  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const [rows, setRows] = React.useState([])
  React.useEffect(() => {
    async function getData() {
      var response =""
      if (fileName =="cars1.mp4")
      {
         response = await fetch(car1)
      }
      else if(fileName =="cars.mp4")
      {
         response = await fetch(car2)
      }
      else{
         response = await fetch(car7)
      }

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

   

  return (
    <div>
      
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