import React from "react";
import styled from "styled-components";

export default styled.button`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  transform-origin: top left;
  transform: rotate(${(props) => props.angle}deg);
  z-index: 99999;
`;
