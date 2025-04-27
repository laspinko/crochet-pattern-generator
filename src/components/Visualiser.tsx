import { useMemo } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { Stitch } from "../logic/graph";

type VisualiserProps = { stitches: Stitch[] };
export const Visualiser = ({ stitches }: VisualiserProps) => {
  const data = useMemo(() => {
    const nodes = stitches.map((stitch) => ({
      id: stitch.id,
      ...stitch.pos,
      color: stitch.yarnColor.toString(),
    }));
    const links = stitches.flatMap((stitch) => [
      ...(stitch.prev
        ? [
            {
              source: stitch.id,
              target: stitch.prev.id,
              label: "top",
              color: stitch.yarnColor.toString(),
            },
          ]
        : []),
      ...stitch.postStitches.map(({ id: target }) => ({
        source: stitch.id,
        target,
        label: "post",
        color: stitch.yarnColor.toString(),
      })),
    ]);
    return {
      nodes,
      links,
    };
  }, [stitches]);

  return (
    <ForceGraph3D
      graphData={data}
      d3AlphaDecay={0.005}
      d3VelocityDecay={0.2}
      cooldownTicks={undefined}
      linkWidth={10}
      width={1000}
    />
  );
};
