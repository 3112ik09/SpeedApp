import { Button } from '@material-ui/core';
import React from 'react'
import { Link } from 'react-router-dom';
import "./styles.css";
import Video from "./Video";
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
function Body() {
  const [imageUpload, setImageUpload] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const videoListRef = ref(storage, "video/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(videoListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
            setVideoUrls((prev) => [...prev, url]);
          });
        });
      });
    }, []);
  return (
    <div className='Body'>
        {videoUrls.map((url , index) => {
          return <div>
            <h1> react player </h1>
            <Video url={url}/>
            <div className='body-pannel'>
              <Link to='/d'>
                  <button>Apply Algo</button>
              </Link>  
              <div>
                  <Button> Import CSV</Button>
              </div>
            </div>

            </div>
        }
        )}
    </div>
  )
}

export default Body