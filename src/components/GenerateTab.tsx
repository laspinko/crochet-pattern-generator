import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { buildPiece, Stitch } from "../logic/graph";
import { spiralCurveHelper, generateEquidistantPoints } from "../logic/curves";

const rowOptions = [...new Array(45)].map((_, i) => i + 5);
type GenerateTabProps = { onStitchesChange: (stitches: Stitch[]) => void };
export const GenerateTab = ({ onStitchesChange }: GenerateTabProps) => {
  const [targetRows, setTargetRows] = useState(rowOptions[0]!);
  return (
    <Stack>
      <Autocomplete
        defaultValue={rowOptions[0]!}
        options={rowOptions}
        renderInput={(params) => <TextField {...params} label="Target rows" />}
        getOptionLabel={(n) => `${n}`}
        disableClearable
        onChange={(_, value) => {
          setTargetRows(value);
        }}
      />
      <Button
        onClick={() => {
          const { curve, rowHeight } = spiralCurveHelper(400, targetRows);
          const points = generateEquidistantPoints(curve, rowHeight);
          onStitchesChange(buildPiece(points, true));
        }}
      >
        Generate pattern
      </Button>
    </Stack>
  );
};
