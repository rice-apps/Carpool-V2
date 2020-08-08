import React from "react";
import styled from "styled-components";
import IllusLanding from "../../assets/illus_landing_page.svg"
import { Link } from "react-router-dom";
import { SERVICE_URL } from '../../config';
import Accordion from './Accordion';


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


const DetailText = styled.div`
    font-size: 2vw;
    // padding-top: 2vh;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    line-height: 2;
`
const Question = styled.div`
    font-size: 1.2vw;
    padding-top: 1vh;
    margin-left: 6vw;
    margin-right: auto;
    // text-align: left;
    // max-width: 24vw;
    line-height: 1.5;
`

const Answer = styled.div`
    font-size: 1vw;
    // padding-top: 5vh;
    margin-left: 7vw;
    margin-right: auto;
    // text-align: left;
    // max-width: 24vw;
    // line-height: 2;
`



const About = ({}) => {
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
                <DetailText>
                    Frequently Asked Questions:
                </DetailText>
                <Accordion title="Who can use Carpool?">
                    Carpool was created for the Rice University Community. A Net ID is required.
                </Accordion>
                <Accordion title="Do I need to download Carpool on my phone?">
                    No, Carpool is not a mobile device app. It was created as website to be accessible through all devices including desktop computers.
                </Accordion>
                <Accordion title="How do I sign up for Carpool?">
                    No sign up is necessary! All you need is your Rice Net ID to log onto the site: carpool.riceapps.org
                </Accordion>
                <Accordion title="I’ve signed in for the first time, now what?">
                    Fill out your profile page with your first name, last name, and phone number.
                    Now you can join and create rides!
                </Accordion>
                <Accordion title="How do I see my past and future rides?">
                    You can find the rides you’ve taken in the past and the rides you’ve scheduled listed on your profile.
                </Accordion>
                <Accordion title="If I leave a ride, will the ride disappear?">
                    If you created a ride and were the only one on the ride, the ride will be deleted. If you joined a ride with other existing riders, the ride will exist but you will not be listed as a rider.
                </Accordion>
                <Accordion title="Is my information shared with outside parties?">
                    No, your information is not shared outside the application. It is only used for coordinating rides with your fellow Rice Owls.
                </Accordion>


            </TextDiv>
        </ContainerDiv>
    )
}

export default About;