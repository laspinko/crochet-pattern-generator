import { Typography } from "@mui/material";
import {
  splitIntoRows,
  generatePattern,
  briefRow,
  patternNotationToString,
} from "../logic/pattern";
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

  const briefRows = useMemo(
    () => splitIntoRows(pattern).map(briefRow),
    [stitches]
  );

  return (
    <>
      <YarnColors colors={yarnColors} onColorsChange={onColorsChange} />
      {briefRows.map(({ briefPattern, stitchCount }, i) => (
        <Typography>
          {i}.{" "}
          {briefPattern.map(({ reps, notation }, i) => (
            <Typography
              display="inline"
              sx={{
                color: notation.yarnColor.toString(),
                background: notation.yarnColor.isLight() ? "black" : "white",
              }}
            >
              {` ${reps > 1 ? reps : ""} ${patternNotationToString(notation)}` +
                (i == briefPattern.length - 1 ? " " : ", ")}
            </Typography>
          ))}{" "}
          ({stitchCount})
        </Typography>
      ))}
    </>
  );
};
