import React from 'react';
import styled from "styled-components";
import Header from '../src/components/Header';
import { Routes } from '../src/components/Routes';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const ContainerDiv = styled.div `
    margin: 0;
    padding: 0;
    ${props => `background: #142538;`}
`;

function App() {
  return (
    <div>
        <ContainerDiv>
          <Header />
          <Routes />
        </ContainerDiv>
    </div>
  );
}

export default App;
