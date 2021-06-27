import React, { useState, useContext, useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../../App";
import GoogleLogin from "react-google-login";
import M from "materialize-css";

const Signin = () => {
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "invalid email",
        classes: "#ff7043 deep-orange lighten-1",
      });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "#ff7043 deep-orange lighten-1",
          });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "Signed in successfully ", classes: "#009688 teal" });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogin = async (googleData) => {
    console.log(googleData.googleId);
    fetch("/gauth/auth_callback", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "#ff7043 deep-orange lighten-1",
          });
          console.log(data.err_details);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "Signed in successfully ", classes: "#009688 teal" });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // store returned user somehow
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>BharatBook</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="row">
          <button
            className="btn waves-effect waves-light "
            onClick={() => PostData()}
          >
            Signin
          </button>
          <GoogleLogin
            clientId="504438976367-lkgjae7k3fu2ufmj85jbqvnilof4rttt.apps.googleusercontent.com"
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
// import React from 'react'

// const Signin = ()=>{
//     return (
//         <h1>Signin</h1>
//     )
// }
// export default Signin
