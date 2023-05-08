
import './App.css';
import Body from './Body';
import Defaulters from './Defaulters';
import Login from './Login';
import OpenCsv from './OpenCsv';
import { useStateValue } from "./StateProvider";
import {BrowserRouter , Router , Route , Routes} from "react-router-dom";
import Header from './Header';
import VideoInput from './VideoInput';
import D2 from './D2';

function App() {

  const [{user}, dispatch] = useStateValue(); 
  return (
    <div className="App">
      <BrowserRouter>
        {!user ? (<Login/>):
          (<>
            {/* Headder  */}
            <Header />
            <div className='app__body'>
            <Routes>
                <Route path="/" element={<Body/>} />
                <Route path="/Login" element={<Login />} />
                <Route path='/d1' element={<Defaulters />}/>
                <Route path='/d' element={<D2 />}/>
                <Route path='/csv/:fileName' element={<OpenCsv />}/>
                <Route path='/c' element={<VideoInput/> }/>
            </Routes>
            </div>
            {/* Side bar  */}
            {/* react rooter */} 
        
          </>)
        }
      </BrowserRouter>
    </div>

    // <div className="App">
    //   <BrowserRouter>
    //   <Routes>
    //       <Route path="/" element={<Body/>} />
    //       <Route path="/Login" element={<Login />} />
    //       <Route path='/d' element={<Defaulters />}/>
    //       <Route path='csv' element={<OpenCsv />}/>
    //   </Routes>
    //   </BrowserRouter>
    // </div>
  );
}

export default App;
