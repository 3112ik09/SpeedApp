import React , { useState }from 'react'
import Img from "./files/mountain-thumb.png";
import Vid from "./files/mountain-video.mp4";
import styled from "styled-components";
import ReactPlayer from "react-player";
import './Video.css';
import { CsvToHtmlTable } from 'react-csv-to-table';
function Video(props) {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false); 
    const onLoadedData = () => {
      setIsVideoLoaded(true);
    };
  return (
    <div className='video'>
        <Container className='videoPlayer'>
        <div>
          <ReactPlayer
            url={props.url}
            playing={true}
            controls={true}
            loop={true}
            muted={true}
            playsinline={true}
            onReady={onLoadedData}
          />
        </div>
        
      </Container>
      <Container>
        <div className='nav'>
          <div className='navCheck'>
              {/* new video with applied algo */}
          </div>
          <div className='navCsv'>
            {/* open the output csv ... */}
          </div>
        </div>
      </Container>
    </div>
  )
}

const Container = styled.div`
  width: 100%;
  position: relative;
  .video-thumb {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition: opacity 400ms ease 0ms;
  }
  .tiny {
    filter: blur(20px);
    transform: scale(1.1);
    transition: visibility 0ms ease 400ms;
  }
`; 

export default Video