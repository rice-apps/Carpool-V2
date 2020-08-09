import React, { useState } from 'react';
import styled from "styled-components";
import { render } from "react-dom";

const Box = styled.div `
    width: 100%;
    border-bottom: 1px solid #E8CA5A;
    margin-left: 6vw;
    
`;

const Title = styled.div `
    padding: 1vw;
    font-weight: 500;
    &:hover {
        cursor: pointer;
        color: #E8CA5A;
    }
    &:active {
        color: #E8CA5A;
    }
`;
  
const Content = styled.div `
    /* padding: 1vw; */
    border-top: 1px solid #E8CA5A;
    font-size: 1vw;
    opacity: ${props => (!props.open ? "1" : "0")};
    max-height: ${props => (!props.open ? "100%" : "0")};
    overflow: hidden;
    padding: ${props => (!props.open ? "1vw" : "0 1vw")};
    transition: all 0.3s ease-in;
`; 


const Accordion = ({ children, title, isExpand = false }) => {
    const [expand, setExpand] = useState(isExpand);
    return (
      <Box>
        <div onClick={() => setExpand(expand => !expand)}>
            {expand ? 
            <Title style={{color: "#E8CA5A"}}>{title}</Title>
            : <Title >{title}</Title>
            }
            {/* <span className="icon"><i className={`fa fa-play-circle${!expand ? ' down' : ''}`}></i></span> */}
        <div className="clearfix"></div>
        </div>
            {expand && <Content open={isExpand}>{children}</Content>} 
      </Box>
    )
  }

  export default Accordion;