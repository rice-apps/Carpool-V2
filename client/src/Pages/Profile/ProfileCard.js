import React from "react";
import styled from "styled-components";
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'

const PageDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-left: 5vh;
    margin-right: 5vh;
    width: 95vw;
    height: auto;
    padding-bottom: .5vh;
`
const Button = styled.div`
    text-decoration: underline;
    text-underline-position: under;
    min-width: 150px;
    min-height: 50px;
    text-align: center;
`

const ProfileCardDiv = styled.div`
    padding-top: 5vh;
    padding-bottom: 5vh;
    background: #223244;
    color: white;
    font-family: Avenir;
`

const ProfileCardName = styled.a`
    font-size: 55px;
    text-decoration: underline;
    text-decoration-color: #E8CA5A;
`
const ProfileContactDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 19vh;
`

const ProfileCardPhone = styled.a`
    font-size: 20px;
`

const ProfileCardEmail = styled.a`
    font-size: 18px;
`

const ProfileImage = styled.img`
    max-width: 8em; 
    max-height: 8em;
    padding: 2em 0 0 0;
`

const ProfileCard = ({ user }) => {

    function sendEmail() {
        window.location = "mailto:" + user.netid + "@rice.edu";
    }

    return (
        <ProfileCardDiv>
            <PageDiv>
                <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
                <ProfileContactDiv>
                    <ProfileCardPhone type='tel'>{formatPhoneNumber("+"+user.phone)}</ProfileCardPhone>
                    <Button onClick={sendEmail}>
                        <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
                    </Button>
                </ProfileContactDiv>
            </PageDiv>
        </ProfileCardDiv>
    )
}

export default ProfileCard;