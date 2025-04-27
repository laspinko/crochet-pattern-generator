import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { buildPiece, Stitch } from "../logic/graph";
import {
  spiralCurveHelper,
  generateEquidistantPoints,
  Point3D,
} from "../logic/curves";

const rowOptions = [...new Array(45)].map((_, i) => i + 5);
type GenerateTabProps = { onPointsChange: (stitches: Point3D[]) => void };
export const GenerateTab = ({ onPointsChange }: GenerateTabProps) => {
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
          onPointsChange(points);
        }}
      >
        Generate pattern
      </Button>
    </Stack>
  );
};
