import React from "react";
import { Field } from "react-final-form";
import { checkError } from './utils';


interface ErrorPros {
  name: any;
}

export const Error = (props: ErrorPros) => (
  <Field
    name={props.name}
    subscription={{
      touched: true,
      error: true,
      submitError: true,
      dirtySinceLastSubmit: true
    }}
    render={({ meta }) =>
      checkError(meta) && (
          <p style={{ color: "#962414", paddingLeft: "10px"}}>{meta.error || meta.submitError}</p>
      )
    }
  />
);