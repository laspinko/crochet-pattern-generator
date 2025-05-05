import { Button, Stack } from "@mui/material";
import Color, { ColorInstance } from "color";
import { useMemo, useState } from "react";
import { NumberPicker } from "./NumberPicker";
import { buildPaletteSync, utils } from "image-q";

const numColorOptions = [...new Array(10)].map((_, i) => i + 1);

type ImageQuantizerProps = {
  onColorsChange: (colors: ColorInstance[]) => void;
  img: ImageData;
};
export const ImageQuantizer = ({
  onColorsChange,
  img,
}: ImageQuantizerProps) => {
  const [numColors, setNumColors] = useState(3);
  const points = useMemo(() => {
    return utils.PointContainer.fromImageData(img);
  }, [img]);
  return (
    <Stack direction="row">
      <NumberPicker
        label="Number of colors"
        onValueChange={setNumColors}
        options={numColorOptions}
      />
      <Button
        onClick={() => {
          onColorsChange(
            buildPaletteSync([points], {
              colors: numColors,
              colorDistanceFormula: "euclidean",
            })
              .getPointContainer()
              .getPointArray()
              .map((point) => Color.rgb(point.r, point.g, point.b))
          );
        }}
      >
        Generate color palette
      </Button>
    </Stack>
  );
};
