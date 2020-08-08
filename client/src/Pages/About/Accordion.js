import React, { useState } from 'react';
import styled from "styled-components";

const Box = styled.div `
    width: 100%;
    border-bottom: 1px solid #E8CA5A;
    margin-left: 6vw;
    
`;

const Title = styled.div `
    padding: 1vw;
    font-weight: bold;
    &:hover {
        cursor: pointer;
        color: #E8CA5A;
    }
    &:active {
        color: #E8CA5A;
    }
`;
  
const Content = styled.div `
    padding: 1vw;
    border-top: 1px solid #E8CA5A;
    transition: height 2s;
    font-size: 1vw;
    
`;


const Accordion = ({ children, title, isExpand = false }) => {
    const [expand, setExpand] = useState(isExpand);
    return (
      <Box>
        <div onClick={() => setExpand(expand => !expand)}>
          <Title>{title}</Title>
          <span className="icon"><i className={`fa fa-play-circle${!expand ? ' down' : ''}`}></i></span>
        <div className="clearfix"></div>
        </div>
         {expand && <Content>{children}</Content>} 
      </Box>
    )
  }

  export default Accordion;