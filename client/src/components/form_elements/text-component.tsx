import React, { useEffect, ChangeEvent, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Box } from "@material-ui/core";

interface TextProps {
  placeholder: string;
  onChange: (e: string) => void;
  options: Array<string>;
}

const TextComponent = (props: TextProps) => {
  const [value, setValue] = useState<string>("");

  const onChange = (val: string | null) => {
    if (val) {
      console.log(val);
      setValue(val);
      props.onChange(val);
    }
  };

  useEffect(() => {
    const getInitData = () => {
      try {
      } catch (error) {
        throw new Error(error);
      }
    };
    getInitData();
  }, []);

  return (
    <Box paddingY="10px" width="100%">
      <Autocomplete
        id="textComponent"
        freeSolo
        options={props.options}
        renderInput={(params: any) => (
          <TextField
            {...params}
            label={props.placeholder}
            variant="outlined"
            fullWidth
          />
        )}
        onInputChange={(event: ChangeEvent<{}>, value: string | null) =>
          onChange(value)
        }
        value={value}
        onBlur={event => console.log(event)}
      />
    </Box>
  );
};

export default TextComponent;
