import { Card, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Color, { ColorInstance } from "color";

type ColorPickerProps = {
  color: ColorInstance;
  id: number;
  onColorChange: (color: ColorInstance) => void;
  onDelete: () => void;
};
export const ColorPicker = ({
  color,
  id,
  onColorChange,
  onDelete,
}: ColorPickerProps) => {
  return (
    <Card>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography>{`#${id}`}</Typography>
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
