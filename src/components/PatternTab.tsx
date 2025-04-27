import { Typography } from "@mui/material";
import { splitIntoRows, rowToString, generatePattern } from "../logic/pattern";
import { Stitch } from "../logic/graph";

type PatternTabProps = {
  stitches: Stitch[];
};
export const PatternTab = ({ stitches }: PatternTabProps) => {
  const pattern = generatePattern(stitches);

  return (
    <>
      {splitIntoRows(pattern).map((row, i) => (
        <Typography>
          {i}. {rowToString(row)}
        </Typography>
      ))}
    </>
  );
};
