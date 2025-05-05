import { Autocomplete, TextField } from "@mui/material";
import { Dispatch } from "react";

type NumberPickerProps = {
  options: number[];
  onValueChange: Dispatch<number>;
  label: string;
};
export const NumberPicker = ({
  options,
  onValueChange,
  label,
}: NumberPickerProps) => {
  return (
    <Autocomplete
      defaultValue={options[0] || 0}
      options={options}
      renderInput={(params) => <TextField {...params} label={label} />}
      getOptionLabel={(n) => `${n}`}
      disableClearable
      onChange={(_, value) => {
        onValueChange(value);
      }}
    />
  );
};
