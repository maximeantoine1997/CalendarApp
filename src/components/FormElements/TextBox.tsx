import { TextareaAutosize, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";

interface TextBoxProps {
   value?: string;
   placeholder: string;
   onChange: (text: string) => void;
   isReadOnly?: boolean;
   variant?: "white" | "grey";
}

const TextBox: React.FunctionComponent<TextBoxProps> = ({
   placeholder,
   onChange: onChange_,
   value: value_ = "",
   isReadOnly = false,
   variant = "grey",
}) => {
   const [value, setValue] = useState<string>(value_);

   const onBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      setValue(text);
      onChange_(text);
   };

   if (isReadOnly) {
      return (
         <Grid container style={{ paddingTop: "25px" }}>
            <Grid item xs={12}>
               <Typography style={{ color: "#7C7B77" }}>{placeholder}:</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography>{value}</Typography>
            </Grid>
         </Grid>
      );
   }

   return (
      <TextareaAutosize
         value={value}
         onChange={onBlur}
         rowsMax={4}
         rowsMin={4}
         style={{
            borderRadius: "5px",
            fontSize: "16px",
            backgroundColor: variant === "white" ? "white" : "#E7EAED",
            marginTop: variant === "white" ? "10px" : "-25px",
            width: "90%",
         }}
         placeholder={placeholder}
      />
   );
};

export default TextBox;
