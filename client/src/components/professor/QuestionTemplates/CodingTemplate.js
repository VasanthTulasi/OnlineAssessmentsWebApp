import styled from "styled-components";
import React from 'react'

function CodingTemplate() {
    return (
        <Coding>
          <label className="label">Enter The Coding Question</label>
          <br />
          <textarea className="" rows="5" cols="50" />
        </Coding>
      );
}

const Coding = styled.div`
margin-top: 10px;
  .label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

`;

export default CodingTemplate
