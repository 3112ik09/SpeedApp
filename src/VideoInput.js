import './VideoInput.css';
import { storage } from "./Firebase";
import React from 'react'
import "./styles.css";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { v4 } from "uuid";



export default function VideoInput(props) {
  const { width, height } = props;
  const [imageUpload, setImageUpload] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const inputRef = React.useRef();
  const videoListRef = ref(storage, "video/");
  const [source, setSource] = React.useState();

  const uploadFile = () => {
    console.log("uploading.... ")
    if (source == null) return;
    
    const imageRef = ref(storage, `video/${source.name}`);
    uploadBytes(imageRef, source).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setSource(url);
    uploadFile();
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };



  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
      />
      <div className="Video_heading"> Select Video to be Uploaded </div>
      {!source && <button onClick={handleChoose}>Choose </button>}
      {source && (
        <video
          className="VideoInput_video"
          width="100%"
          height={height}
          controls
          src={source}
        />
      )}
      <div className="VideoInput_footer">{source || "Nothing selected"}</div>
      <button onClick={uploadFile}> Push to Database</button>
    </div>
  );
}
