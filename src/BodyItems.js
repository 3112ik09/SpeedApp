import React from 'react'
import { Link } from 'react-router-dom';
import Video from './Video';

function BodyItems(props) {

    function handleClick(){
        console.log("the goning -->"+props.url);
        if(props.url!='')
        fetch("/api", {
          method: 'POST',
          body: JSON.stringify({
             "url":props.url,
          }),
          headers: {
             'Content-type': 'application/json; charset=UTF-8',
          },
       }).then( response => response.json()
        )
        else
        {
        alert("Error occured");
        }
        
      };
  return (
    <div >
            <Video url={props.url}/>
            <div className='body_pannel'>
              <Link to='http://127.0.0.1:5000/'>
                  <button onClick={handleClick} >Apply Algo</button>
              </Link>
              <div>
                <Link to='/csv'>
                  <button> Import CSV</button>
                </Link>
              </div>
             
            </div>
            <hr/>


            </div>
  )
}

export default BodyItems