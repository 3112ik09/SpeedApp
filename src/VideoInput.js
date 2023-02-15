import { Button } from "@material-ui/core";
import React from "react";
import './VideoInput.css';
export default function VideoInput(props) {
  const { width, height } = props;

  const inputRef = React.useRef();

  const [source, setSource] = React.useState();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setSource(url);
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
      {!source && <Button onClick={handleChoose}>Choose </Button>}
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
    </div>
  );
}
