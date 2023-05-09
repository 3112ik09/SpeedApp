import { Button } from '@material-ui/core';
import React, { useState , useEffect } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import './Defaulters.css';
import axios from 'axios';

function Defaulters(props) {
  const [crop, setCrop] = useState({ aspect: 1 });
  const [imageSrc, setImageSrc] = useState(props.url);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [numberPlate, setNumberPlate] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kk , setkk] = useState('')
  
  const handleClick = () => {
      // Your code for fetching vehicle data
      fetch('/Form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageSrc })
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setkk(data.CarMake.CurrentTextValue)
        setVehicleData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Manually setting values for testing
 

  return (
      <div className="App">
          <div className="container">
              <div className="image-container">
                  <img src={imageSrc} alt="Placeholder image" />
                  <button onClick={handleClick}> Search Details </button>
              </div>
              <div className="text-container">
                <h1> Vehicle Details </h1>
                  {vehicleData && (
                      <>
                          <div>
                              <p>Make: {kk}</p>
                              <p>Model: {vehicleData.CarModel.CurrentTextValue}</p>
                              <p>Owner: {vehicleData.Owner}</p>
                              <p>Registration Date: {vehicleData.RegistrationDate}</p>
                              <p>Registration Year: {vehicleData.RegistrationYear}</p>
                              <p>Location: {vehicleData.Location}</p>
                              <p>Vechile Identification Number: {vehicleData.VechileIdentificationNumber}</p> 
                          </div>
                      </>
                  )}
              </div>
              <hr></hr>
          </div>
      </div>
  )
}

export default Defaulters