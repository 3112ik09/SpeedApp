import { Button } from '@material-ui/core';
import React from 'react'
import { Link } from 'react-router-dom';
import "./styles.css";
import Video from "./Video";
function Body() {
  return (
    <div className='Body'>
        <h1> react player </h1>
        <Video/>
        <div className='body-pannel'>
          <Link to='/d'>
              <button>Apply Algo</button>
          </Link>  
          <div>
              <Button> Import CSV</Button>
          </div>
        </div>
    </div>
  )
}

export default Body