import React from "react";
import styled from "styled-components";

const ProfileCardDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ProfileCardName = styled.h2`
    font-size: 25px;
`

const ProfileCardPhone = styled.h4`
    font-size: 20px;
`

const ProfileCardEmail = styled.h5`
    font-size: 15px;
`

const ProfileCard = ({ user }) => {

    return (
        <ProfileCardDiv>
            <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
            <ProfileCardPhone>{user.phone}</ProfileCardPhone>
            <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
        </ProfileCardDiv>
    )
}

export default ProfileCard;