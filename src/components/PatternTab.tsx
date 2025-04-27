import { Typography } from "@mui/material";
import { splitIntoRows, rowToString, generatePattern } from "../logic/pattern";
import { recolour, Stitch } from "../logic/graph";
import { useEffect, useMemo, useState } from "react";
import Color, { ColorInstance } from "color";
import { YarnColors } from "./YarnColors";

type PatternTabProps = {
  stitches: Stitch[];
  onStitchesChange: (stitches: Stitch[]) => void;
};
export const PatternTab = ({ stitches, onStitchesChange }: PatternTabProps) => {
  const pattern = generatePattern(stitches);
  const [yarnColors, setYarnColors] = useState<ColorInstance[]>([
    Color("white"),
    Color("blue"),
  ]);

  useEffect(() => {
    onStitchesChange(recolour(stitches, yarnColors));
  }, [yarnColors]);

  const rows = useMemo(() => splitIntoRows(pattern), [stitches]);

  return (
    <>
      <YarnColors colors={yarnColors} onColorsChange={setYarnColors} />
      {rows.map((row, i) => (
        <Typography>
          {i}. {rowToString(row)}
        </Typography>
      ))}
    </>
  );
};
