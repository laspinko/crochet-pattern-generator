import ForceGraph3D from "react-force-graph-3d";
import { generateEquidistantPoints, spiralCurveHelper } from "./logic/curves";
import { buildPiece } from "./logic/graph";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { generatePattern, rowToString, splitIntoRows } from "./logic/pattern";
import { useMemo, useState } from "react";

const rowOptions = [...new Array(45)].map((_, i) => i + 5);
function App() {
  const [targetRows, setTargetRows] = useState(rowOptions[0]!);
  const stitches = useMemo(() => {
    const { curve, rowHeight } = spiralCurveHelper(400, targetRows);
    const points = generateEquidistantPoints(curve, rowHeight);
    return buildPiece(points, true);
  }, [targetRows]);

  const data = useMemo(() => {
    const nodes = stitches.map((stitch) => ({
      id: stitch.id,
      ...stitch.pos,
    }));
    const links = stitches.flatMap((stitch) => [
      ...(stitch.prev
        ? [{ source: stitch.id, target: stitch.prev.id, label: "top" }]
        : []),
      ...stitch.postStitches.map(({ id: target }) => ({
        source: stitch.id,
        target,
        label: "post",
      })),
    ]);
    return {
      nodes,
      links,
    };
  }, [stitches]);

  const pattern = generatePattern(stitches);

  return (
    <Stack direction="row">
      <ForceGraph3D
        graphData={data}
        d3AlphaDecay={0.005}
        d3VelocityDecay={0.2}
        cooldownTicks={0}
        nodeColor={(node) =>
          `hsl(${(node.id / data.nodes.length) * 300},100,50)`
        }
        linkWidth={5}
        linkAutoColorBy={"label"}
        width={1000}
        height={800}
      />
      <Stack>
        <Autocomplete
          defaultValue={rowOptions[0]!}
          options={rowOptions}
          renderInput={(params) => (
            <TextField {...params} label="Target rows" />
          )}
          getOptionLabel={(n) => `${n}`}
          disableClearable
          onChange={(_, value) => {
            setTargetRows(value);
          }}
        />
        {splitIntoRows(pattern).map((row, i) => (
          <Typography>
            {i}. {rowToString(row)}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}

export default App;
