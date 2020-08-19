import React from "react";
import styled from "styled-components";
import IllusLanding from "../../assets/illus_landing_page.svg";
import { Link } from "react-router-dom";
import { SERVICE_URL } from '../../config';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import SimpleAccordion from './MaterialAccordion.js';
import ColorsTimeline from './Timeline.js';
import FadeIn from 'react-fade-in';
import wyao from '../../assets/wyao.jpg';
import gjia from '../../assets/gjia.jpg';
import wli from '../../assets/wli.png';
import hhu from '../../assets/hhu.jpg';
import wmundy from '../../assets/wmundy.jpg';
import sgoyal from '../../assets/sgoyal.jpg';
import ccai from '../../assets/ccai.jpg';
import { isNamedType } from "graphql";
// import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Card } from 'reactstrap';


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
    font-family: AvenirLTStd-Book;
    color: white;
`;

const PictureDiv = styled.div `
    grid-column: 5 / 8;
    font-family: AvenirLTStd-Book;
    color: white;
`;


const DetailText = styled.div`
    font-size: 2vw;
    margin-left: 6vw;
    margin-right: auto;
    text-align: left;
    line-height: 2;
`

const PictureText = styled.div`
    font-size: 2vw;
    /* margin-left: 6vw;
    margin-right: auto; */
    text-align: left;
    line-height: 2;
`

const Gap = styled.div`
    min-height: 5vh;
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

const AboutCard = ({name, description, image}) => {
    return (
        <Card style={{ width: '18vw', float: 'left', marginRight: '2vw' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    image={image}
                    style = {{ height: '35vh'}}
                    title={name}
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                    {name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" align="center">
                    {description}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const SecondaryAboutCard = ({name, description, image}) => {
    return (
        <Card style={{ width: '18vw', float: 'left', marginLeft: 'auto', marginRight: '2vw', marginTop:'2vw'}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    image={image}
                    style = {{ height: '35vh'}}
                    title={name}
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                    {name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" align="center">
                    {description}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

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
                <FadeIn>
                <DetailText>
                    Frequently Asked Questions:
                </DetailText>
                <SimpleAccordion title="Who can use Carpool?">
                    Carpool was created for the Rice University Community. A Net ID is required.
                </SimpleAccordion>
                <SimpleAccordion title="Do I need to download Carpool on my phone?">
                    No, Carpool is not a mobile device app. It was created as website to be accessible through all devices including desktop computers.
                </SimpleAccordion>
                <SimpleAccordion title="How do I sign up for Carpool?">
                    No sign up is necessary! All you need is your Rice Net ID to log onto the site: carpool.riceapps.org
                </SimpleAccordion>
                <SimpleAccordion title="I’ve signed in for the first time, now what?">
                    Fill out your profile page with your first name, last name, and phone number.
                    Now you can join and create rides!
                </SimpleAccordion>
                <SimpleAccordion title="How do I see my past and future rides?">
                    You can find the rides you’ve taken in the past and the rides you’ve scheduled listed on your profile.
                </SimpleAccordion>
                <SimpleAccordion title="If I leave a ride, will the ride disappear?">
                    If you created a ride and were the only one on the ride, the ride will be deleted. If you joined a ride with other existing riders, the ride will exist but you will not be listed as a rider.
                </SimpleAccordion>
                <SimpleAccordion title="How can I delete a ride?">
                    You can access the rides you have created your profile page. Clicking on the ride card brings you to a page where you can delete your ride via the
                    "Delete this ride" button. Alternatively, you can see the rides you have created on the find ride page, and you can delete them from there.
                </SimpleAccordion>
                <SimpleAccordion title="Is my information shared with outside parties?">
                    No, your information is not shared outside the application. It is only used for coordinating rides with your fellow Rice Owls.
                </SimpleAccordion>
                <Gap />
                <DetailText>
                    Our Product Roadmap:
                </DetailText>
                <ColorsTimeline />
                </FadeIn>
            </TextDiv>
            <PictureDiv>
                <FadeIn>
                <PictureText>
                    Meet The Team:
                </PictureText>
                <AboutCard name="Winnie Li" description="Team Lead - McMurtry College" image={wli} />
                <AboutCard name="Will Mundy" description="Mentor - Sid Richardson College" image={wmundy}/>
                <SecondaryAboutCard name="Guancong Jia" description="Developer - Brown College" image={gjia} />
                <SecondaryAboutCard name="William Yao" description="Developer - Will Rice College" image={wyao} />
                <SecondaryAboutCard name="Shryans Goyal" description="Mentor - Will Rice College" image={sgoyal} />
                <SecondaryAboutCard name="Helena Hu" description="Designer - Jones College" image={hhu} />
                <SecondaryAboutCard name="Cloris Cai" description="Designer - Will Rice College" image={ccai} />
                </FadeIn>
            </PictureDiv>
        </ContainerDiv>
    )
}

export default About;