import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'

const darkMode = localStorage.getItem('darkMode') === 'true'
const isMobile = window.innerWidth < consts.maxPanelWidth
const lightThemeBgColour = isMobile ? consts.lightTheme.frontPanelColour : consts.lightTheme.bgColour
const bgColour = darkMode ? consts.darkTheme.bgColour : lightThemeBgColour
const trayColour = darkMode ? consts.darkTheme.trayColour : consts.lightTheme.trayColour
const shadowColour = darkMode ? consts.darkTheme.shadowColour : consts.lightTheme.shadowColour
const textColour = darkMode ? consts.darkTheme.textColour : consts.lightTheme.textColour
const boxShadow = `0 0 ${consts.shadowBlur}px 0 ${shadowColour}`

export function Spinner() {
  return (
    <FullScreen>
      <Wrapper>
        <SpinnerDiv className='lds-ellipsis'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </SpinnerDiv>
      </Wrapper>
      <LoadingText>Loading</LoadingText>
    </FullScreen>
  )
}

const FullScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${consts.margin}px;
  align-items: center;
  justify-content: center;
  background-color: ${bgColour};
  width: ${window.innerWidth}px;
  height: ${window.innerHeight}px;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${consts.spinnerWidth}px;
  height: ${consts.spinnerWidth}px;
  border-radius: ${consts.spinnerWidth}px;
  background-color: ${isMobile ? '' : trayColour};
  box-shadow: ${isMobile ? '' : boxShadow};
`

const LoadingText = styled.div`
  margin-top: 150px;
  margin-left: 10px;
  position: absolute;
  color: ${textColour};
  letter-spacing: 10px;
  text-transform: uppercase;
  font-size: 14px;
`

const SpinnerDiv = styled.div`
  display: inline-block;
  position: relative;
  width: 70px;
  height: 10px;
  transform: scale(0.5);
  left: -3px;

  > div {
    background: ${textColour};
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  > div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }

  > div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  > div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  > div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`
