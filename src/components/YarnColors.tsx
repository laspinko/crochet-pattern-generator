import { IconButton, Stack, Typography } from "@mui/material";
import Color, { ColorInstance } from "color";
import { ColorPicker } from "./ColorPicker";
import update from "immutability-helper";
import AddIcon from "@mui/icons-material/Add";

type YarnColorsProps = {
  colors: ColorInstance[];
  onColorsChange: (colors: ColorInstance[]) => void;
};
export const YarnColors = ({ colors, onColorsChange }: YarnColorsProps) => {
  return (
    <Stack>
      <Typography variant="h5">Available yarn colors</Typography>
      <Stack direction="row" flexWrap="wrap">
        {colors.map((color, i) => (
          <ColorPicker
            id={i}
            color={color}
            onColorChange={(color) =>
              onColorsChange(update(colors, { [i]: { $set: color } }))
            }
            onDelete={() =>
              onColorsChange(update(colors, { $splice: [[i, 1]] }))
            }
          />
        ))}
        <IconButton
          onClick={() =>
            onColorsChange(update(colors, { $push: [Color("white")] }))
          }
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};
