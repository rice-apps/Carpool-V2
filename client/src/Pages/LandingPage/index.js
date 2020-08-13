import React from "react";
import FadeIn from 'react-fade-in';
import styled from "styled-components";
import IllusLanding from "../../assets/illus_landing_page.svg"
import { Link } from "react-router-dom";
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
    font-family: acari-sans.light;
    color: white;
`;

const Slogan = styled.div `
    font-size: 5vw;
    padding-top: 5vh;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    text-decoration: underline;
    text-decoration-color: #E8CA5A;
`;

const DetailText = styled.div`
    font-size: 1.5vw;
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

// const GET_SERVICE_LOCAL = gql`
//     query GetService {
//         service @client # @client indicates that this is a local field; we're just looking at our cache, NOT our backend!
//     }
// `;

const LandingPage = ({}) => {
    // Fetch service from cache since it depends on where this app is deployed
    // const { data } = useQuery(GET_SERVICE_LOCAL);

    // Handles click of login button
    const handleClick = () => {
        // Redirects user to the CAS login page
        let redirectURL = casLoginURL + "?service=" + SERVICE_URL;
        window.open(redirectURL, "_self");
        console.log("BOIIII landing page ");
        if (localStorage.getItem('token')) {
            console.log("BOIIII TOKEN landping page");
            window.location = "./profile"
        } 
    }
    return (
        <ContainerDiv>
            <TextDiv>
                <FadeIn transitionDuration='900'>
                    <Slogan>
                        Hit the Road with ONE click
                    </Slogan>
                    <DetailText>
                        Getting ready for a trip? Make this amazing journey with your friends &amp; <strong>Rice Carpool</strong>
                    </DetailText>
                    <Link onClick={handleClick}>
                        <Login>Login</Login>
                    </Link>
                </FadeIn>
            </TextDiv>
            <GraphicDiv>
                <FadeIn transitionDuration='900'>
                    <Illus src={IllusLanding} alt="Landing Page"/>
                </FadeIn>
            </GraphicDiv>
        </ContainerDiv>
    )
}

export default LandingPage;