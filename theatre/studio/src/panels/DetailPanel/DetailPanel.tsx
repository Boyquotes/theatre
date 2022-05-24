import {getOutlineSelection} from '@theatre/studio/selectors'
import {usePrism, useVal} from '@theatre/react'
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {isProject, isSheetObject} from '@theatre/shared/instanceTypes'
import {
  panelZIndexes,
  TitleBar_Piece,
  TitleBar_Punctuation,
} from '@theatre/studio/panels/BasePanel/common'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import ObjectDetails from './ObjectDetails'
import ProjectDetails from './ProjectDetails'
import getStudio from '@theatre/studio/getStudio'
import useHotspot from '@theatre/studio/uiComponents/useHotspot'

const headerHeight = `32px`

const Container = styled.div<{pin: boolean}>`
  background-color: rgba(40, 43, 47, 0.8);
  position: fixed;
  right: 8px;
  top: 50px;
  width: 236px;
  height: fit-content;
  z-index: ${panelZIndexes.propsPanel};

  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(14px);
  border-radius: 2px;

  display: ${({pin}) => (pin ? 'block' : 'none')};

  &:hover {
    display: block;
  }
`

const Title = styled.div`
  margin: 0 10px;
  color: #919191;
  font-weight: 500;
  font-size: 10px;
  user-select: none;
  ${pointerEventsAutoInNormalMode};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Header = styled.div`
  height: ${headerHeight};
  display: flex;
  align-items: center;
`

const Body = styled.div`
  ${pointerEventsAutoInNormalMode};
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  padding: 0;
  user-select: none;
`

const DetailPanel: React.FC<{}> = (props) => {
  const pin = useVal(getStudio().atomP.ahistoric.pinDetails)

  const active = useHotspot('right')
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    getStudio().transaction(({stateEditors, drafts}) => {
      stateEditors.studio.ephemeral.setShowDetails(active || hovered)
    })
  }, [active, hovered])

  return usePrism(() => {
    const selection = getOutlineSelection()

    const obj = selection.find(isSheetObject)
    if (obj) {
      return (
        <Container
          pin={pin || active}
          onMouseEnter={() => {
            setHovered(true)
          }}
          onMouseLeave={() => {
            setHovered(false)
          }}
        >
          <Header>
            <Title
              title={`${obj.sheet.address.sheetId}: ${obj.sheet.address.sheetInstanceId} > ${obj.address.objectKey}`}
            >
              <TitleBar_Piece>{obj.sheet.address.sheetId} </TitleBar_Piece>

              <TitleBar_Punctuation>{':'}&nbsp;</TitleBar_Punctuation>
              <TitleBar_Piece>
                {obj.sheet.address.sheetInstanceId}{' '}
              </TitleBar_Piece>

              <TitleBar_Punctuation>&nbsp;&rarr;&nbsp;</TitleBar_Punctuation>
              <TitleBar_Piece>{obj.address.objectKey}</TitleBar_Piece>
            </Title>
          </Header>
          <Body>
            <ObjectDetails objects={[obj]} />
          </Body>
        </Container>
      )
    }
    const project = selection.find(isProject)
    if (project) {
      return (
        <Container pin={pin || active}>
          <Header>
            <Title title={`${project.address.projectId}`}>
              <TitleBar_Piece>{project.address.projectId} </TitleBar_Piece>
            </Title>
          </Header>
          <Body>
            <ProjectDetails projects={[project]} />
          </Body>
        </Container>
      )
    }

    return <></>
  }, [pin, active])
}

export default DetailPanel
