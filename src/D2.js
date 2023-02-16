import "./App.css";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./Firebase";
import { v4 } from "uuid";
import Defaulters from "./Defaulters";

function D2() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  // Now the canvas for the crop and send ... 
  const [crop, setCrop] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);


    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => setImageSrc(reader.result));
        console.log("input")
        reader.readAsDataURL(file);
      };
      
      const handleCropComplete = croppedArea => {
        // console.log("inside ha")
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
            const url = canvas.toDataURL('image/jpeg');
            setCroppedImageUrl(url);
          };
        }
      };

  return (
    <div className="D2">
      {/* <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      /> */}
      {/* <button onClick={uploadFile}> Upload Image</button> */}
      <div className="dlist">
        <h1> Defaulters List </h1>
      </div>
      {imageUrls.map((url ,index) => {
        return <div key={index}>
                     <br></br> 
                     {/* <img className="displayimage" height={200} src={url} /> */}
                     {/* <ReactCrop
                            src={url}
                            crop={crop}
                            key={index}
                            onChange={newCrop => setCrop(newCrop)}
                            onComplete={handleCropComplete}
                        >
                            <img
                        src={url}
                        />
                            </ReactCrop> */}
                        <Defaulters url={url} key={index} />
                </div>;
      })}
    </div>
  );
}

export default D2;