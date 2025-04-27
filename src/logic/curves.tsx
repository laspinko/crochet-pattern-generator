export type Point3D = { x: number; y: number; z: number };

const spiral = (r: number, alpha: number, alphaMax: number): Point3D => {
  const verticalAlpha = (alpha / alphaMax - 1 / 2) * Math.PI;
  return {
    x: r * Math.cos(alpha) * Math.cos(verticalAlpha),
    y: r * Math.sin(alpha) * Math.cos(verticalAlpha),
    z: -r * Math.sin(verticalAlpha),
  };
};

export const distance = (a: Point3D, b: Point3D) => {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y) +
      (a.z - b.z) * (a.z - b.z)
  );
};

export const spiralCurveHelper = (r: number, rows: number) => {
  const alphaMax = rows * Math.PI * 2;
  const rowHeight = (r * Math.PI) / rows;
  return { curve: (t: number) => spiral(r, t * alphaMax, alphaMax), rowHeight };
};

export const generateEquidistantPoints = (
  curve: (t: number) => Point3D,
  targetLength: number
) => {
  // Determines the resolution
  const nSamples = 10000;
  const samples = [...Array(nSamples)].map((_, i) => curve(i / (nSamples - 1)));
  type Accumulator = {
    prevSample: Point3D | null;
    cumulativeDistance: number;
    points: Point3D[];
  };
  const points = samples.reduce(
    ({ prevSample, cumulativeDistance, points }, currSample): Accumulator => {
      const dist = prevSample ? distance(currSample, prevSample) : 0;
      if (cumulativeDistance + dist > targetLength) {
        return {
          prevSample: currSample,
          cumulativeDistance: cumulativeDistance + dist - targetLength,
          points: [...points, currSample],
        };
      } else {
        return {
          prevSample: currSample,
          cumulativeDistance: cumulativeDistance + dist,
          points,
        };
      }
    },
    { prevSample: null, cumulativeDistance: 0, points: [] } as Accumulator
  ).points;

  return points;
};
