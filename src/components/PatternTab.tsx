import { Typography } from "@mui/material";
import { splitIntoRows, rowToString, generatePattern } from "../logic/pattern";
import { Stitch } from "../logic/graph";
import { useMemo } from "react";
import { ColorInstance } from "color";
import { YarnColors } from "./YarnColors";

type PatternTabProps = {
  stitches: Stitch[];
  yarnColors: ColorInstance[];
  onColorsChange: (colors: ColorInstance[]) => void;
};
export const PatternTab = ({
  stitches,
  yarnColors,
  onColorsChange,
}: PatternTabProps) => {
  const pattern = generatePattern(stitches);

  const rows = useMemo(() => splitIntoRows(pattern), [stitches]);

  return (
    <>
      <YarnColors colors={yarnColors} onColorsChange={onColorsChange} />
      {rows.map((row, i) => (
        <Typography>
          {i}. {rowToString(row)}
        </Typography>
      ))}
    </>
  );
};
