import React,{useContext,useState,useRef,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {userContext} from '../App'
import M from "materialize-css"
const NavBar = () =>{
    const {state,dispatch}=useContext(userContext)
    const renderList=()=>{
        if(state){
            return [
                <li><Link to="/create">Create</Link></li>,
                <li><Link to="/history">History</Link></li>
            ]
        }else{
            return [
                <li><Link to="/signin">Login</Link></li>,   
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return(
        <nav>
            <div className="nav-wrapper white" style={{color:"black"}}>
            <Link to={state?"/":"/signin"} className="brand-logo left">Email karo</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
            </ul>
            </div>
        </nav>
    )
}

export default NavBar
