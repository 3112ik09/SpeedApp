import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { auth } from './Firebase';
import ReactSearchBox from "react-search-box";
// import ShoppingBasketIcon from '@mui/icons-material';
function Header () {

  const [{basket , user} , dispatch] = useStateValue();
  const handleAuthenticaton = () => {
    if (user) {
        user = 'guest';
      auth.signOut();
    }
  }

  return (
    <div className='header'>
      <Link to='/'>
            <div className='header__shop'>
                    Home
                </div>
        </Link>
        <div className='header__search'>
            <ReactSearchBox
            placeholder="search" />
        </div>
        <div className='header__nav'>
            <Link to='/d'>
                <div className='header__shop'>
                    Defaulter
                </div>
            </Link>
            {/* <FaceIcon /> */}

            <Link to='/c'> 
                <div className ="header__shop">
                    Upload Video
                  </div>
            </Link>

            <Link to={!user && '/login'}>
                <div onClick={handleAuthenticaton} className='header__option'>
                  <span className='header__optionlineOne'> Hello {!user ? 'Guest' : user.email}</span>
                  <span className='header__optionlineTwo'> {user ? 'Sign Out' : 'Sign In'} </span>
                </div>
            </Link>
        
            

        </div>
    </div>
  )
}

export default Header ;