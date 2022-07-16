import styled from "styled-components";
import React from 'react'

function FIBTemplate() {
    return (
        <FIB>
          <label className="label">Enter The FIB Question</label>
          <br />
          <textarea className="" onChange="textAreaChanged" rows="5" cols="50" />
        </FIB>
      );
}

const FIB = styled.div`
margin-top: 10px;
  .label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

`;

export default FIBTemplate
