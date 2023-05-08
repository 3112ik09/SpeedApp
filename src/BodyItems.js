import React from 'react'
import { Link } from 'react-router-dom';
import Video from './Video';

function BodyItems(props) {
  function handleClick() {
    console.log("the going -->" + props.url);
    if (props.url !== '') {
      fetch("/api", {
        method: 'POST',
        body: JSON.stringify({
          "url": props.url,
          "name": props.name,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    } else {
      alert("Error occurred");
    }
  }

  return (
    <div>
      <Video url={props.url} />
      <div className='body_pannel'>
        <button onClick={handleClick}>Apply Algo</button>
        <div>
          <Link to={`/csv/${props.name}`}>
            <button>Import CSV</button></Link>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default BodyItems;
