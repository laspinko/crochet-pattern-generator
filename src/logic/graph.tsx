import { ColorInstance } from "color";
import { distance, Point3D } from "./curves";

export type Stitch = {
  id: number;
  prev: Stitch | null;
  postStitches: Stitch[];
  pos: Point3D;
  yarnColor: ColorInstance;
};

const pickColor = (target: ColorInstance, colors: ColorInstance[]) =>
  [...colors].sort(
    (a, b) => colorDistance(a, target) - colorDistance(b, target)
  )[0] || target;

export const buildPiece = (
  points: Point3D[],
  yarnColors: ColorInstance[],
  closeAtTheEnd?: boolean
): Stitch[] => {
  type Accumulator = {
    stitches: Stitch[];
    openStitches: Stitch[];
  };
  const stitches = points.reduce(
    ({ stitches, openStitches }, point, i): Accumulator => {
      const prev = stitches[stitches.length - 1] || null;

      // Close at the end
      if (closeAtTheEnd && i == points.length - 1) {
        const curr: Stitch = {
          id: i,
          prev,
          pos: point,
          postStitches: openStitches.slice(0, openStitches.length - 1),
          yarnColor: pickColor(point.color, yarnColors),
        };
        return { stitches: [...stitches, curr], openStitches: [] };
      }

      type OpenStitchesAccumulator = {
        skipped: Stitch[];
        closest: null | Stitch;
        remaining: Stitch[];
      };
      const { skipped, closest, remaining } = openStitches.reduce(
        (
          { skipped, closest, remaining },
          currOpen,
          i
        ): OpenStitchesAccumulator => {
          if (
            remaining.length > 0 ||
            i >= openStitches.length - 1 ||
            (closest &&
              distance(point, currOpen.pos) > distance(point, closest.pos))
          ) {
            return { skipped, closest, remaining: [...remaining, currOpen] };
          } else {
            return {
              skipped: closest ? [...skipped, closest] : skipped,
              closest: currOpen,
              remaining,
            };
          }
        },
        {
          skipped: [],
          closest: null,
          remaining: [],
        } as OpenStitchesAccumulator
      );

      const curr: Stitch = {
        id: i,
        prev,
        pos: point,
        // If the last stitch was not a decrease, ignore the first open stitch to avoid dec+inc in the same stitch
        postStitches: [
          ...skipped.slice(prev && prev.postStitches.length == 1 ? 1 : 0),
          ...(closest ? [closest] : []),
        ],
        yarnColor: pickColor(point.color, yarnColors),
      };
      return {
        stitches: [...stitches, curr],
        openStitches: [
          ...(curr.postStitches.length == 1 && closest ? [closest] : []),
          ...remaining,
          curr,
        ],
      };
    },
    {
      stitches: [],
      openStitches: [],
    } as Accumulator
  ).stitches;
  return stitches;
};

const colorDistance = (a: ColorInstance, b: ColorInstance) => {
  return Math.sqrt(
    (a.red() - b.red()) * (a.red() - b.red()) +
      (a.green() - b.green()) * (a.green() - b.green()) +
      (a.blue() - b.blue()) * (a.blue() - b.blue())
  );
};

export const recolour = (piece: Stitch[], colors: ColorInstance[]): Stitch[] =>
  piece.map((stitch): Stitch => {
    return {
      ...stitch,
      yarnColor: pickColor(stitch.pos.color, colors),
    };
  });
