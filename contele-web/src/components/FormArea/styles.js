import styled from "styled-components";

export const Container = styled.div`
  background-color: #f7f7f7;
  width: 100%;
  min-height: 700px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0px 11% 0px;

  @media (max-width: 1050px) {
    flex-direction: column;
  }

  @media (max-width: 650px) {
    padding: 0px 5% 0px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TitleSectionForm = styled.h2`
  font-size: 27px;
  color: #161e6b;
  margin: 35px 20px 0px;
`;

export const SectionForm = styled.div`
  padding-top: 5px;
  width: 48%;
  height: auto;
  justify-content: center;
  align-items: center;

  @media (max-width: 1050px) {
    width: 100%;
    margin-bottom: 35px;
  }
`;
