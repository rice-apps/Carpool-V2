import React from "react";
import styled from "styled-components";
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'

const ContainerDiv = styled.div `
    ${props => `background: #142538;`}
    color: white;
    font-family: Avenir;
`;

const PageDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 10em;
    flex: 1;
`

const Button = styled.div`
    background-color: #359d99;
    border: none;
    color: white;
    min-width: 150px;
    min-height: 50px;
    text-align: center;
    vertical-align: middle;
    line-height: 2.7;
    transition: background-color .2s linear;
    &:hover {
        background-color: #4ec2bd;
    }
`

const ProfileCardDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    min-width: 25em;
    box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
    text-align: center;
    flex: 1;
`

const ProfileCardName = styled.a`
    font-size: 35px;
`

const ProfileCardPhone = styled.a`
    font-size: 20px;
`

const ProfileCardEmail = styled.a`
    font-size: 18px;
    vertical-align: middle;
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
        <ContainerDiv>
        <ProfileCardDiv>
            <PageDiv>
                <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
                <ProfileCardPhone type='tel'>{formatPhoneNumber("+"+user.phone)}</ProfileCardPhone>
                <Button onClick={sendEmail}>
                    <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
                </Button>
            </PageDiv>
        </ProfileCardDiv>
        </ContainerDiv>
    )
}

export default ProfileCard;