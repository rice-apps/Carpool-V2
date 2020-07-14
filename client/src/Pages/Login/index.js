import React from "react";
import styled from "styled-components";
import IllusLanding from "../../assets/illus_landing_page.svg"
import { useQuery, gql } from "@apollo/client";
import { SERVICE_URL } from '../../config';

const casLoginURL = "https://idp.rice.edu/idp/profile/cas/login";

const ContainerDiv = styled.div `
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    margin-left: 5vh;
    margin-right: 5vh;
    width: 95vw;
    height: auto;
    padding-bottom: .5vh;
`;

const TextDiv = styled.div `
    grid-column: 1 / 4;
    min-width: 0;
    font-family: Avenir;
    color: white;
`;

const StepText = styled.div`
    font-size: 3vh;
    font-weight: bold;
    padding-top: 5vh;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    max-width: 24vw;
    line-height: 1.5;
`

const DetailText = styled.div`
    font-size: 2.5vh;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    max-width: 24vw;
    line-height: 1.5;
`

const LoginButton = styled.a`
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
    border-radius: 1.2vh;
    display: inline-block;
    font-size: 3vh;
    cursor: pointer;
`
const Illus = styled.img`
    width: 100%;
    height: 85vh;
`;

const GraphicDiv = styled.div `
    grid-column: 4 / 8;
    color: white;
`;

// const GET_SERVICE_LOCAL = gql`
//     query GetService {
//         service @client # @client indicates that this is a local field; we're just looking at our cache, NOT our backend!
//     }
// `;

const Login = () => {
    // Fetch service from cache since it depends on where this app is deployed
    // const { data } = useQuery(GET_SERVICE_LOCAL);

    // Handles click of login button
    const handleClick = () => {
        // Redirects user to the CAS login page
        let redirectURL = casLoginURL + "?service=" + SERVICE_URL;
        window.open(redirectURL, "_self");
    }

    return (
        <ContainerDiv>
            <TextDiv>
                <StepText>
                    Step 1
                </StepText>
                <DetailText>
                    Sign up with your Rice ID and head to your profile to set up your name and phone number.
                </DetailText>
                <StepText>
                    Step 2
                </StepText>
                <DetailText>
                    Make or join a ride using the links at the top of the page. Search for rides on certain dates or to certain places.
                </DetailText>
                <StepText>
                    Step 3
                </StepText>
                <DetailText>
                    Watch your email for updates on your ride. Attend rides with fellow Rice students to save money!
                </DetailText>
                <LoginButton onClick={handleClick}>Login</LoginButton>
            </TextDiv>
            <GraphicDiv>
                <Illus src={IllusLanding} alt="Landing Page"/>
            </GraphicDiv>
        </ContainerDiv>
    )
}

export default Login;