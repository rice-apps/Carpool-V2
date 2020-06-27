import React from "react";
import styled from "styled-components";
import IllusLanding from "../../assets/illus_landing_page.svg"
import { Link } from "react-router-dom";

const ContainerDiv = styled.div `
    display: grid;
    gird-template-columns: repeat(7, minmax(0, 1fr));
    margin-left: 5vh;
    margin-right: 5vh;
    width: 95vw;
    height: 86vh;
`;

const TextDiv = styled.div `
    grid-column: 1 / 4;
    min-width: 0;
    font-family: acari-sans.light;
    color: white;
`;

const Slogan = styled.div `
    font-size: 75px;
    padding-top: 5vh;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    text-decoration: underline;
    text-decoration-color: #E8CA5A;
`;

const DetailText = styled.div`
    font-size: 25px;
    padding-top: 5vh;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    max-width: 24vw;
    line-height: 2;
`

const Login = styled.div`
    background-color: black;
    margin-left: 19vw;
    margin-right: auto;
    margin-top: 3vh;
    color: #E8CA5A;
    padding: 1vh;
    text-align: center;
    text-decoration: none;
    border-style: solid;
    border-color: #E8CA5A;
    border-radius: 10px;
    display: inline-block;
    font-size: 25px;
`

const Illus = styled.img`
    width: 100%;
    height: 85vh;
`;

const GraphicDiv = styled.div `
    grid-column: 4 / 8;
    color: white;
`;

const About = ({}) => {

    return (
        <ContainerDiv>
            <TextDiv>
                <Slogan>
                    HIT the ROAD with ONE click
                </Slogan>
                <DetailText>
                    Getting ready for a trip? Make this amazing journey with your friends &amp; <strong>Rice Carpool</strong>
                </DetailText>
                <Link to="/login">
                    <Login>Login</Login>
                </Link>
            </TextDiv>
            <GraphicDiv>
                <Illus src={IllusLanding} alt="Landing Page"/>
            </GraphicDiv>
        </ContainerDiv>
    )
}

export default About;