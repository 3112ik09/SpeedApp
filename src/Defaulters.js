import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './Defaulters.css';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./Firebase";


function Defaulters(props) {
    const [crop, setCrop] = useState({ aspect: 1 });
    const [imageSrc, setImageSrc] = useState(props.url);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
      e.preventDefault();
      try {
        let res = await fetch("/Form", {
          method: "POST",
          body: JSON.stringify({
            Image:imageSrc,
          }),
        });
        let resJson = await res.json();
        if (res.status === 200) {
          setMessage("User created successfully");
        } else {
          setMessage("Some error occured");
        }
      } catch (err) {
        console.log(err);
      }
    };


    function handleFileSelect(e) {
      const file = e.target.files[0];
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
  
      fileRef.put(file).then((snapshot) => {
        console.log('Uploaded file', snapshot);
      });
    }

    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => setImageSrc(reader.result));
        console.log("input")
        reader.readAsDataURL(file);
      };
      
      const handleCropComplete = croppedArea => {
        console.log("inside ha")
        if (croppedArea && imageSrc) {
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.src = imageSrc;
          img.onload = () => {
            canvas.width = croppedArea.width;
            canvas.height = croppedArea.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
              img,
              croppedArea.x,
              croppedArea.y,
              croppedArea.width,
              croppedArea.height,
              0,
              0,
              croppedArea.width,
              croppedArea.height
            );
            const url2 = canvas.toDataURL('image/jpg');
            console.log(url2)
            setCroppedImageUrl(url2);
          };
        }
      };


  return (
    <div className='defaulter_box'>
    {/* <input className="settings-file-upload" type="file"  accept="image/*" onChange={handleImageChange} />  */}
    {/* <div>
      <input type="file" onChange={handleFileSelect} />
    </div> */}
    {imageSrc && (
      <ReactCrop 
        src={imageSrc}
        crop={crop}
        onChange={newCrop => setCrop(newCrop)}
        onComplete={handleCropComplete}
      >
        <img className='d_image'
       src={imageSrc}
    />
       
        </ReactCrop>
    )}
    <br></br>
    <div className="App">
      <form onSubmit={handleSubmit}>
        <button type="submit">Create</button>
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
    
  </div>
  )
}

export default Defaulters