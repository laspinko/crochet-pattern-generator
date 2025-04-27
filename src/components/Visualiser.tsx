import { useEffect, useMemo, useState } from "react";
import ForceGraph3D, {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-3d";
import { Stitch } from "../logic/graph";

type VisualiserProps = { stitches: Stitch[] };
export const Visualiser = ({ stitches }: VisualiserProps) => {
  const [data, setData] = useState<
    GraphData<NodeObject<{ stitch: Stitch }>, LinkObject<{ stitch: Stitch }>>
  >({ nodes: [], links: [] });

  useEffect(() => {
    setData((oldData) => {
      const nodes = stitches.map((stitch) => ({
        id: stitch.id,
        ...stitch.pos,
        stitch,
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
      return { nodes, links };
    });
  }, [stitches]);

  return (
    <ForceGraph3D<{ stitch: Stitch }>
      graphData={data}
      //d3AlphaDecay={0.005}
      //d3VelocityDecay={0.2}
      linkWidth={10}
      nodeColor={(node) => "white"}
      width={1000}
    />
  );
};
