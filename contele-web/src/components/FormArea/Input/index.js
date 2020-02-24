import React from "react";

import {
  CustomInput,
  CustomSelectInput,
  AreaCheckbox,
  Label,
  CustomInputCheckbox
} from "./styles";

import iconCheckedBox from "../../../assets/icon-checkedBox.png";
import iconCheckBox from "../../../assets/icon-checkBox.png";

export default function Input({
  name,
  select,
  checkbox,
  type = "text",
  label,
  defaultValue,
  ...rest
}) {
  if (select) {
    return (
      <CustomSelectInput
        className={name}
        defaultValue={defaultValue}
        {...rest}
      />
    );
  } else if (checkbox) {
    return (
      <AreaCheckbox className="divCheckbox">
        <CustomInputCheckbox
          className={name}
          icon={<img src={iconCheckBox} alt={"check icon"} />}
          checkedIcon={<img src={iconCheckedBox} alt={"checked icon"} />}
          {...rest}
        />
        <Label>{label}</Label>
      </AreaCheckbox>
    );
  } else {
    return <CustomInput className={name} type={type} {...rest} />;
  }
}
