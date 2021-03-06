import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";
import M from "materialize-css";
const NavBar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/create">Create</Link>
        </li>,
        <li>
          <Link to="/history">History</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light "
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
        <li>
          <Link to="/">
            <img src={JSON.parse(localStorage.getItem("user"))["pic"]} alt="" />
          </Link>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white" style={{ color: "black" }}>
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Email karo
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
