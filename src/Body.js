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
import BodyItems from './BodyItems';
function Body() {
  const [imageUpload, setImageUpload] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [videos, setVideos] = useState([]);


  const videoListRef = ref(storage, "video/");
  // const uploadFile = () => {
  //   if (imageUpload == null) return;
  //   const imageRef = ref(storage, `images/${imageUpload.name}`);
  //   uploadBytes(imageRef, imageUpload).then((snapshot) => {
  //     getDownloadURL(snapshot.ref).then((url) => {
  //       setImageUrls((prev) => [...prev, url]);
  //     });
  //   });
  // };
  

  useEffect(() => {
    listAll(videoListRef).then((response) => {
      response.items.forEach((item) => {
        Promise.all([getDownloadURL(item), item.name]).then(([url, name]) => {
          setVideoUrls((prev) => [...prev, { url, name }]);
          });
        });
      });
    }, []);



  // useEffect(() => {
  //   // Get a reference to the videos folder in Firebase Storage
 

  //   // Get a list of all the videos in the folder
  //   listAll(videoListRef).then(listResult => {
  //     // Loop through each video and get its download URL and name
  //     const promises = listResult.items.map(itemRef => {
  //       return itemRef.getDownloadURL().then(url => {
  //         return itemRef.getMetadata().then(metadata => {
  //           return { name: metadata.name, url };
  //         });
  //       });
  //     });

  //     // Resolve all the promises and set the videos state variable
  //     Promise.all(promises).then(videos => {
  //       setVideos(videos);
  //     }).catch(error => {
  //       console.error(error);
  //     });
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // }, []);


  return (
    <div className='Body'>
        <h1 style="font-family: Open Sans; font-size: 32px; font-weight: bold; color: #333; margin-bottom: 20px;" >Analyzing Video for Accurate Speed Detection</h1>
        {videoUrls.map((video , index) => {
          return <BodyItems url={video.url} name={video.name}/>
        }
        )}
    </div>
  )
}

export default Body