import { useEffect, useRef, useState } from "react";
import ForceGraph3D, {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-3d";
import { Stitch } from "../logic/graph";
import { ColorInstance } from "color";

type Node = {
  id: number;
  x: number;
  y: number;
  z: number;
};
type Link = {
  source: number;
  target: number;
  label: string;
  distance: number;
};
type Data = {
  nodes: Node[];
  links: Link[];
};

const buildData = (stitches: Stitch[]): Data => {
  const nodes = stitches.map((stitch) => ({
    id: stitch.id,
    x: stitch.pos.x,
    y: stitch.pos.y,
    z: stitch.pos.z,
  }));
  const links = stitches.flatMap((stitch) => [
    ...(stitch.prev
      ? [
          {
            source: stitch.id,
            target: stitch.prev.id,
            label: "top",
            distance: 40,
          },
        ]
      : []),
    ...stitch.postStitches.map((other) => ({
      source: stitch.id,
      target: other.id,
      label: "post",
      distance: 40,
    })),
  ]);
  return { nodes, links };
};

const dataHash = (data: Data) =>
  JSON.stringify({
    nodes: data.nodes.map((node) => node.id),
    links: data.links.map(({ source, target }) => ({
      source,
      target,
    })),
  });

type VisualiserProps = { stitches: Stitch[] };
export const Visualiser = ({ stitches }: VisualiserProps) => {
  const [data, setData] = useState<Data>({ nodes: [], links: [] });
  const lastDataHash = useRef("");
  const colorMap = useRef<Map<number, ColorInstance>>(new Map());
  const forceGraphRef = useRef<
    ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>> | undefined
  >(undefined);

  useEffect(() => {
    /// The d3 simulation mutates the data, and also whenever the data reference is refreshed the simulation reheats
    const newData = buildData(stitches);
    const newDataHash = dataHash(newData);
    colorMap.current = new Map(
      stitches.map((stitch) => [stitch.id, stitch.yarnColor])
    );
    if (newDataHash != lastDataHash.current) {
      lastDataHash.current = newDataHash;

      setData(newData);
    } else {
      forceGraphRef.current?.renderer();
    }
  }, [stitches]);

  return (
    <ForceGraph3D
      ref={forceGraphRef}
      graphData={data}
      //d3AlphaDecay={0.005}
      //d3VelocityDecay={0.2}
      linkWidth={10}
      nodeColor={(node) => colorMap.current.get(node.id)!.toString()}
      linkColor={(link: any) => {
        // d3 mutates the link objects, as well as their types
        const sourceId = Object.keys(link.source).includes("id")
          ? link.source.id
          : link.source;
        return colorMap.current.get(sourceId)!.toString();
      }}
      forceEngine="d3"
      width={1000}
    />
  );
};
