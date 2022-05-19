import React from 'react';
import logo from './logo.svg';
import styled from 'styled-components';
import { MainLayout } from './MainLayout';

const AppContainer = styled.div`
  font-family: 'Roboto', Helvetica, Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;

  background: linear-gradient(to top right,rgb(20, 20, 20), rgb(29, 29, 29));
`

export const App = () => {
  return (
    <AppContainer>
      <MainLayout />
    </AppContainer>
  );
}
