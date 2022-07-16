import styled from "styled-components";
import React from 'react'

function EssayTemplate() {
    return (
        <Essay>
          <label className="label">Enter The Essay Question</label>
          <br />
          <textarea className="" onChange="textAreaChanged" rows="5" cols="50" />
        </Essay>
      );
}

const Essay = styled.div`
margin-top: 10px;
  .label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

`;

export default EssayTemplate
