import styled from "styled-components";

export const ContainerButton = styled.button.attrs(props => ({
  ...props
}))`
  width: 270px;
  height: 40px;
  border-radius: 5px;
  border: none;
  background-color: #1a237a;
  align-self: flex-end;
  margin: 2% 16% 2%;
  transition: all 0.5s;
  cursor: pointer;
  :hover {
    background-color: #080e4d;
  }

  @media (max-width: 350px) {
    margin: 2% 5% 2%;
  }
`;

export const TextButton = styled.p`
  color: #fff;
  font-size: 16px;
`;
