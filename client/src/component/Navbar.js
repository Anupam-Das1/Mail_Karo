import React, { Component } from 'react'
import {Link,useHistory} from 'react-router-dom'

const NavBar = () =>{
    return(
        <nav>
            <div className="nav-wrapper white" style={{color:"black"}}>
            <Link to="#" className="brand-logo left">Logo</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/signin">Login</Link></li>
                <li><Link to="/create">Create</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/signup">Signup</Link></li>
            </ul>
            </div>
        </nav>
    )
}

export default NavBar
