import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './Defaulters.css';

function Defaulters(props) {
    const [crop, setCrop] = useState({ aspect: 1 });
    const [imageSrc, setImageSrc] = useState(props.url);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);


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
    <input className="settings-file-upload" type="file"  accept="image/*" onChange={handleImageChange} /> 
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
    <div className='dfuntion'>
    
      <img className='c_image' alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
    
    <Button class="mui-btn mui-btn--small mui-btn--primary mui-btn--raised"> Send Warning </Button>
    </div>
    
  </div>
  )
}

export default Defaulters