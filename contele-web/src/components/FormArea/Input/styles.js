import styled from "styled-components";
import icon from "../../../assets/icon-angle-down.png";

import { Checkbox } from "@material-ui/core";

export const CustomInput = styled.input.attrs(props => ({
  ...props
}))`
  border-radius: 10px;
  border: 1px solid #00000044;
  padding: 5px 15px 5px;
  margin-top: 34px;
  margin-right: 2%;
  margin-left: 2%;
  font-size: 12px;
  height: 38px;
  width: ${props => (props.width ? props.width : 40)}%;
  transition: all 0.2s;

  ::placeholder {
    color: #808080aa;
  }
  :focus {
    border-color: #00000066;
  }

  :disabled {
    background: #00000011;
  }

  @media (max-width: 650px) {
    width: 95%;
  }
`;

export const CustomSelectInput = styled.select.attrs(props => ({
  ...props
}))`
  border-radius: 10px;
  border: 1px solid #00000044;
  padding: 5px 15px 5px;
  margin-top: 35px;
  margin-right: 2%;
  margin-left: 2%;
  font-size: 12px;
  height: 38px;
  width: ${props => (props.width ? props.width : 40)}%;
  transition: all 0.2s;
  color: #808080aa;

  :focus {
    border-color: #00000066;
  }

  /* Changing select icon */
  -webkit-appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  overflow: hidden;
  overflow: -moz-hidden-unscrollable;
  background: url(${icon}) no-repeat right #fff;

  /* styling options  */
  option {
    color: #000;
    background: #fff;
    display: flex;
    font-size: 12px;
    align-self: center;
    min-height: 20px;
    padding: 1px 1px 1px;
  }

  /* Hiden default option  */
  option:default {
    display: none;
  }

  :disabled {
    background: #00000011;
  }

  @media (max-width: 650px) {
    width: 95%;
  }
`;

export const AreaCheckbox = styled.div`
  display: flex;
  flex: 1;
  margin-top: 25px;
  margin-bottom: -5px;
  width: auto;
  min-width: 42%;
  margin-left: 5px;
  margin-right: 10px;
  align-items: center;
`;

export const CustomInputCheckbox = styled(Checkbox).attrs(props => ({
  id: props.fieldName,
  size: "medium"
}))``;

export const Label = styled.label`
  font-size: 12px;
  color: #000000aa;
  margin-left: 5px;
  align-self: center;
  max-width: 265px;
`;
