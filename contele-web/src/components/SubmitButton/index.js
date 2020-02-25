import React from "react";

import { ContainerButton, TextButton } from "./styles";

export default function SubmitButton({
  text = "Default Button",
  onClick = () => alert("Submit Button")
}) {
  return (
    <ContainerButton onClick={onClick}>
      <TextButton>{text}</TextButton>
    </ContainerButton>
  );
}
