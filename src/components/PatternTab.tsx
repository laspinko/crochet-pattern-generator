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

  const getYarnId = (color: ColorInstance): Number | null =>
    yarnColors.findIndex((yarn) => yarn == color) + 1 || null;

  return (
    <>
      <YarnColors colors={yarnColors} onColorsChange={onColorsChange} />
      {briefRows.map(({ briefPattern, stitchCount }, rowIndex) => (
        <Typography>
          {rowIndex}.{" "}
          {briefPattern.map(({ reps, notation }, notationIndex) => {
            const last =
              briefPattern[notationIndex - 1] ||
              briefRows[rowIndex - 1]?.briefPattern.slice(-1)[0] ||
              null;
            const yarnId = getYarnId(notation.yarnColor);
            const colorChange =
              rowIndex == 0 && notationIndex == 0
                ? `Start with #${yarnId} `
                : last &&
                  yarnId &&
                  last.notation.yarnColor != notation.yarnColor
                ? `Change to #${yarnId} `
                : null;
            return (
              <>
                <Typography
                  display="inline"
                  sx={{
                    color: notation.yarnColor.toString(),
                    background: notation.yarnColor.isLight()
                      ? "black"
                      : "white",
                  }}
                >
                  <Typography display="inline" fontWeight="bold">
                    {colorChange}
                  </Typography>
                  {` ${reps > 1 ? reps : ""} ${patternNotationToString(
                    notation
                  )}` + (notationIndex == briefPattern.length - 1 ? " " : ", ")}
                </Typography>
              </>
            );
          })}{" "}
          ({stitchCount})
        </Typography>
      ))}
    </>
  );
};
