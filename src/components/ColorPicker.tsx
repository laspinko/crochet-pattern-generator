import { Card, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Color, { ColorInstance } from "color";

type ColorPickerProps = {
  color: ColorInstance;
  onColorChange: (color: ColorInstance) => void;
  onDelete: () => void;
};
export const ColorPicker = ({
  color,
  onColorChange,
  onDelete,
}: ColorPickerProps) => {
  return (
    <Card>
      <Stack direction="row" alignItems="center">
        {" "}
        <input
          type="color"
          value={color.hex().toString()}
          onChange={(e) => onColorChange(Color(e.target.value))}
        ></input>
        <IconButton onClick={onDelete}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Card>
  );
};
