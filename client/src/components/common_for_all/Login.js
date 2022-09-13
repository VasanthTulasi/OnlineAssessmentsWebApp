import React, { useContext } from "react";
import { useState, useEffect } from "react";
import LoginRightBGImage from "../../svgs/right_background.svg";
import styled from "styled-components";
import Axios from "axios";
import { LandingContext } from "../../contexts/LandingContext";
import { LoginContext } from "../../contexts/LoginContext";

function Login() {
  const { setCurrentSection } = useContext(LandingContext);
  const { setIsUserLoggedIn, setLoggedInUserDetails } =
    useContext(LoginContext);

  //Login variables
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const registerHereButtonClicked = () => {
    setCurrentSection("register");
  };

  const forgotPasswordButtonClicked = () => {
    setCurrentSection("forgotpassword");
  };

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const loginButtonClicked = async () => {
    if (loginEmail === "") setErrorMessage("Email field cannot be blank!");
    else if (loginPassword === "")
      setErrorMessage("Password field cannot be blank!");
    else {
      axios
        .post("/login", {
          email: loginEmail,
          password: loginPassword,
        })
        .then((res) => {
          if (res.data.message !== "success") setErrorMessage(res.data.message);
          else {
            setIsUserLoggedIn(true);
            setLoggedInUserDetails({
              email: res.data.user_data.email,
              first_name: res.data.user_data.first_name,
              last_name: res.data.user_data.last_name,
              role: res.data.user_data.role,
              uni_id: res.data.user_data.uni_id,
            });
          }
        });
    }
  };

  return (
    <LoginSection>
      <div className="login-heading">
        <span>Login</span>
      </div>
      <div className="login-card">
        <label className="login-email-label">Enter Your Email</label>
        <input
          className="login-email-text-field"
          placeholder="Email"
          id="login_email"
          onChange={(event) => {
            setLoginEmail(event.target.value);
            setErrorMessage("");
          }}
        />
        <label className="login-password-label">Enter Your Password</label>
        <input
          className="login-password-text-field"
          placeholder="Password"
          id="login_password"
          type="password"
          onChange={(event) => {
            setLoginPassword(event.target.value);
            setErrorMessage("");
          }}
        />
        <div className="forgot-password" onClick={forgotPasswordButtonClicked}>
          Forgot Password?
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button className="login-button" onClick={loginButtonClicked}>
          LOGIN
        </button>
        <div className="new-user" onClick={registerHereButtonClicked}>
          New User? Register Here
        </div>
      </div>
    </LoginSection>
  );
}

const LoginSection = styled.div`
  /* background-color: #61dafb; */
  /* background-color: white; */
  background-image: url("${LoginRightBGImage}");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100vh;
  flex: 6;
  /* border: 2px solid red; */
  display: flex;
  align-items: center;
  flex-direction: column;

  .login-heading {
    /* border: 2px solid cyan; */
    display: flex;
    align-items: flex-end;
    flex: 1.3;
  }

  .login-card {
    margin-top: 70px;
    /* border: 2px solid blue; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 3.5;
  }

  span {
    color: #282c34;
    font-family: "Sora", sans-serif;
    font-size: 32px;
    /* border: 1px solid red; */
  }

  .login-email-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

  .login-email-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 2px;
    width: 500px;
    height: 40px;
    padding-left: 10px;
    /* background-color: #61dafb;
    opacity: 0.5; */
  }

  .login-password-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .login-password-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 2px;
    width: 500px;
    height: 40px;
    padding-left: 10px;
    /* background-color: #61dafb;
    opacity: 0.5; */
  }

  #login_email::placeholder {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    opacity: 0.6;
  }

  #login_password::placeholder {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    opacity: 0.6;
  }

  .forgot-password {
    margin-top: 5px;
    /* border: 1px solid red; */
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
  }

  .forgot-password:hover {
    cursor: pointer;
  }

  .login-button {
    margin-top: 60px;
    border: 1px solid #282c34;
    /* border: 0px; */
    color: white;
    background-color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 500;
    width: 100%;
    height: 45px;
    letter-spacing: 3px;
    border-radius: 5px;
  }

  .login-button:hover {
    cursor: pointer;
  }

  .new-user {
    margin-top: 5px;
    /* border: 1px solid red; */
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
  }

  .new-user:hover {
    cursor: pointer;
  }

  .error-message {
    color: red;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 15px;
    font-weight: 600;
    margin-top: 10px;
  }
`;

export default Login;
