import React, { useContext } from "react";
import styled from "styled-components";
import LoginRightBGImage from "../../../svgs/right_background.svg";
import { useState } from "react";
import Axios from "axios";
import { LandingContext } from "../../../contexts/LandingContext";

function Register() {
  const { setCurrentSection } = useContext(LandingContext);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/pendingregistrations",
    crossDomain: true,
  });

  //Register variables
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerRole, setRegisterRole] = useState("student");
  const [registerUniIDNumber, setRegisterUniIDNumber] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerReenterPassword, setRegisterReenterPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const alreadyRegisterClicked = () => {
    setCurrentSection("login");
  };

  //Registration Methods
  const registerClicked = () => {
    let errorMessageString = "";
    if (
      registerFirstName === "" ||
      registerLastName === "" ||
      registerUniIDNumber === "" ||
      registerEmail === "" ||
      registerPassword === "" ||
      registerReenterPassword === ""
    ) {
      errorMessageString += "All the fields must be filled.\n\n";
    }
    if (isNaN(registerUniIDNumber)) {
      errorMessageString +=
        "University ID Number must contain only numeric characters.\n\n";
    }

    if (registerUniIDNumber.length !== 9) {
      errorMessageString += "University ID Number must be of 9 digits.\n\n";
    }

    if (!registerEmail.includes("@") || !registerEmail.includes(".")) {
      errorMessageString += "Invalid Email format entered.\n\n";
    }
    if (registerPassword.length < 8) {
      errorMessageString += "Password should contain atleast 8 characters.\n\n";
    }
    if (registerPassword !== registerReenterPassword) {
      errorMessageString +=
        "Password and Re-enter password fields must match.\n\n";
    }

    if (errorMessageString !== "") {
      setErrorMessage("Error(s):\n\n" + errorMessageString);
    } else {
      setErrorMessage("");
      axios
        .post("/", {
          first_name: registerFirstName,
          last_name: registerLastName,
          email: registerEmail,
          password: registerPassword,
          role: registerRole,
          uni_id: registerUniIDNumber,
        })
        .then((res) => {
          if (res.data.message === "success")
            setCurrentSection("registrationrequested");
          else if (res.data.message === "already registered")
            setErrorMessage("Account already exists with this email!");
          else if (res.data.message === "already pending approval")
            setErrorMessage(
              "Your account is already pending approval from the admin.\nPlease keep checking your email inbox for further updates."
            );
          else setErrorMessage(res.data.message);
        });
    }
  };

  return (
    <RegisterSection>
      <div className="headerpart">
        <div className="register-heading">
          <span>Register</span>
        </div>
      </div>
      <div className="bodypart">
        <div className="register-card">
          <div>
            <label className="role-dropdown-label">I am a </label>
            <select
              id="role_dropdown"
              className="role-dropdown"
              defaultValue="student"
              onChange={(event) => setRegisterRole(event.target.value)}
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          <label className="register-first-name-label">
            Enter Your First Name
          </label>
          <input
            className="register-first-name-text-field"
            placeholder="First Name"
            id="register_first_name"
            onChange={(event) => setRegisterFirstName(event.target.value)}
          />
          <label className="register-last-name-label">
            Enter Your Last Name
          </label>
          <input
            className="register-last-name-text-field"
            placeholder="Last Name"
            id="register_last_name"
            onChange={(event) => setRegisterLastName(event.target.value)}
          />
          <label className="register-uni-id-number">
            Enter Your University ID Number
          </label>
          <input
            className="register-uni-id-number-text-field"
            placeholder="University ID Number"
            id="register_uni_id_number"
            onChange={(event) => setRegisterUniIDNumber(event.target.value)}
          />
          <label className="register-email-label">
            Enter Your University Email
          </label>
          <input
            className="register-email-text-field"
            placeholder="University Email"
            id="register_email"
            onChange={(event) => setRegisterEmail(event.target.value)}
          />
          <label className="register-password-label">Enter Your Password</label>
          <input
            className="register-password-text-field"
            placeholder="Password"
            id="register_password"
            type="password"
            onChange={(event) => setRegisterPassword(event.target.value)}
          />
          <label className="register-re-enter-password-label">
            Re-Enter Your Password
          </label>
          <input
            className="register-re-enter-password-text-field"
            placeholder="Re-enter Password"
            id="register_re_enter_password"
            type="password"
            onChange={(event) => setRegisterReenterPassword(event.target.value)}
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="register-button" onClick={registerClicked}>
            REGISTER
          </button>
          <div className="already-registered" onClick={alreadyRegisterClicked}>
            Already Registered? Login Here
          </div>
        </div>
      </div>
    </RegisterSection>
  );
}

const RegisterSection = styled.div`
  background-image: url("${LoginRightBGImage}");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100vh;
  flex: 6;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;

  .headerpart {
    flex: 1;
    /* border: 2px solid cyan; */
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: 40px;
  }

  .bodypart {
    flex: 9;
    /* border: 2px solid blue; */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 40px;
  }

  .register-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    /* border: 2px solid red; */
  }

  span {
    color: #282c34;
    font-family: "Sora", sans-serif;
    font-size: 32px;
    /* border: 1px solid red; */
  }

  .role-dropdown-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

  .role-dropdown {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 20px;
    width: max-width;
    height: 30px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .register-first-name-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }
  .register-first-name-text-field {
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
  }

  .register-last-name-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }
  .register-last-name-text-field {
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
  }

  .register-uni-id-number {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .register-uni-id-number-text-field {
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

  .register-email-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .register-email-text-field {
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

  .register-password-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .register-password-text-field {
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

  .register-re-enter-password-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .register-re-enter-password-text-field {
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

  #register_email::placeholder {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    opacity: 0.6;
  }

  #register_password::placeholder {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    opacity: 0.6;
  }

  .register-button {
    margin-top: 30px;
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

  .register-button:hover {
    cursor: pointer;
  }

  .already-registered {
    margin-top: 5px;
    /* border: 1px solid red; */
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
  }

  .already-registered:hover {
    cursor: pointer;
  }

  .error-message {
    color: red;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 15px;
    font-weight: 600;
    margin-top: 30px;
    border: 1px solid red;
    border-radius: 8px;
    width: 100%;
    padding: 10px;
    white-space: pre-line;
  }
`;

export default Register;
