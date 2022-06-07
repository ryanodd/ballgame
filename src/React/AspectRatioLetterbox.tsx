import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

const AspectRatioWrapper = styled.div<{ horizontal: boolean }>` //todo rename this param once I understand what it does
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  /* background-color: rgb(50, 119, 90); */

  ${props => props.horizontal && css`
    writing-mode: vertical-lr;
  `}
`

const AspectRatioDiv = styled.div<{ horizontal: boolean }>`
  position: relative;
  box-sizing: content-box;

  ${props => props.horizontal ? css`
    height: 100%;
    width: 0;
    padding-right: calc(100% * (16 / 9));
  ` : css`
    width: 100%;
    height: 0;
    padding-bottom: calc(100% * (9 / 16));
  `}
`
const ContentWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  writing-mode: horizontal-tb;
`

export type AspectRatioLetterboxProps = {
  children?: ReactNode;
}

export const AspectRatioLetterbox = ({children}: AspectRatioLetterboxProps) => {
  const [shouldUseHorizontalLetterbox, setShouldUseHorizontalLetterbox] = useState(true)
  const aspectRatioWrapper = useRef<HTMLDivElement | null>(null)
  const detectWidth = useCallback(() => {
    const aspectRatioWrapperElement = aspectRatioWrapper.current
    if (aspectRatioWrapperElement) {
      const contentWrapperAspectRatio = aspectRatioWrapperElement.clientWidth / aspectRatioWrapperElement.clientHeight
      setShouldUseHorizontalLetterbox(contentWrapperAspectRatio >= (16 / 9))
    }
  }, [])
  useEffect(() => {
    detectWidth();
		window.addEventListener('resize', detectWidth)
    return () => {
      window.removeEventListener('resize', detectWidth)
    }
  })

  return (
    <AspectRatioWrapper
      horizontal={shouldUseHorizontalLetterbox}
      ref={aspectRatioWrapper}
    >
      <AspectRatioDiv horizontal={shouldUseHorizontalLetterbox}>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </AspectRatioDiv>
    </AspectRatioWrapper>
  )
}
