import React from 'react';
import { styled } from "@material-ui/styles";

export const SideBarContent = styled("div")({
  flex: 'auto',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: '1',
});

const SideBarSectionWrapper = styled("div")({
  flex: ({flex}) => `${flex || 'unset'}`,
  display: 'flex',
  flexDirection: 'column',
});

const SideBarSectionTitle = styled("div")({
  textAlign: "center",
  fontSize: "bold",
});

const SideBarSectionContent = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  overflowY: 'scroll',
});

const SideBarSection = ({ children, title, style, contentStyle, flex }) => {
  return (
    <SideBarSectionWrapper style={style} flex={flex}>
      <SideBarSectionTitle>{title}</SideBarSectionTitle>
      <SideBarSectionContent style={contentStyle} >{children}</SideBarSectionContent>
    </SideBarSectionWrapper>
  );
};


export default SideBarSection;
