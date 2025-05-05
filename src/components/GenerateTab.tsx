import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import {
  spiralCurveHelper,
  generateEquidistantPoints,
  Point3D,
} from "../logic/curves";
import ImageUpload from "./ImageUploadButton";
import { YarnColors } from "./YarnColors";
import { ColorInstance } from "color";

const rowOptions = [...new Array(45)].map((_, i) => i + 5);
type GenerateTabProps = {
  onPointsChange: (stitches: Point3D[]) => void;
  yarnColors: ColorInstance[];
  onColorsChange: (colors: ColorInstance[]) => void;
};
export const GenerateTab = ({
  onPointsChange,
  onColorsChange,
  yarnColors,
}: GenerateTabProps) => {
  const [targetRows, setTargetRows] = useState(rowOptions[0]!);
  const [image, setImage] = useState<ImageData | null>(null);
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
      <ImageUpload onUpload={setImage} />
      <YarnColors colors={yarnColors} onColorsChange={onColorsChange} />
      <Button
        onClick={() => {
          const { curve, rowHeight } = spiralCurveHelper(
            400,
            targetRows,
            image
          );
          const points = generateEquidistantPoints(curve, rowHeight);
          onPointsChange(points);
        }}
      >
        Generate pattern
      </Button>
    </Stack>
  );
};
