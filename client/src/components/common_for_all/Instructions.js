import React from "react";
import styled from "styled-components";
import LoginLeftBGImage from "../../svgs/left_background.svg";

function Instructions(props) {

  return (
    <InstructionsSection>
      <div className="welcome-text-div">
        <p className="welcome-text">
          Welcome to <span>AssessOnline</span>
        </p>
      </div>
      <div className="other-texts">
        <p className="login-text">
         {props.page === "resetPassword" ? "Please reset your password using the password reset fields on the right side." : "Please login to the application using your registered email address."}
        </p>
        <p className="instructions">
          Feel free to contact us in case of any queries using the link below.
        </p>
        {/* <a className="contact-us-link" href="https://www.google.com">
          Contact Us
        </a> */}
      </div>
    </InstructionsSection>
  );

}

export default Instructions;

const InstructionsSection = styled.div`

  /* background: #282c34; */
  background-image: url("${LoginLeftBGImage}");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  flex: 3.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* border: 2px solid blue; */

  .welcome-text-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 4;
    /* border: 2px solid red; */
  }

  .other-texts {
    margin-left: 90px;
    margin-right: 90px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 6;
  }

  .welcome-text {
    color: white;
    font-family: "Sora", sans-serif;
    font-size: 32px;
    /* border: 1px solid red; */
    vertical-align: middle;
  }

  .login-text {
    /* border: 1px solid red; */
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 22px;
    font-weight: 350;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .instructions {
    /* border: 1px solid red; */
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 22px;
    font-weight: 350;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .contact-us-link {
    margin-top: 20px;
    margin-bottom: 20px;
    /* border: 1px solid red; */
    color: #61dafb;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 22px;
    font-weight: 350;
  }

  span {
    color: #61dafb;
    /* font-family: "Fascinate Inline", cursive; */
    font-family: "Sora", sans-serif;

  }
`;

