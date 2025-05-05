import { Button, Stack } from "@mui/material";
import { useState } from "react";
import {
  spiralCurveHelper,
  generateEquidistantPoints,
  Point3D,
} from "../logic/curves";
import ImageUpload from "./ImageUploadButton";
import { YarnColors } from "./YarnColors";
import { ColorInstance } from "color";
import { NumberPicker } from "./NumberPicker";
import { ImageQuantizer } from "./ImageQantizer";

const rowOptions = [...new Array(46)].map((_, i) => i + 5);
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
    <Stack gap={2}>
      <NumberPicker
        label="Target rows"
        onValueChange={setTargetRows}
        options={rowOptions}
      />
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
        Generate geometry
      </Button>
      <ImageUpload onUpload={setImage} />
      {image && (
        <ImageQuantizer
          colors={yarnColors}
          onColorsChange={onColorsChange}
          img={image}
        />
      )}
      <YarnColors colors={yarnColors} onColorsChange={onColorsChange} />
    </Stack>
  );
};
