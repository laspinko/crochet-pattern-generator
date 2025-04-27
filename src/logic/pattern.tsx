import { ColorInstance } from "color";
import { Stitch } from "./graph";

type PatternNotation = (
  | { _t: "sc" }
  | { _t: "inc"; num: number }
  | { _t: "dec"; num: number }
  | { _t: "ch" }
  | { _t: "mr" }
  | { _t: "finish off"; num: number }
  | { _t: "unknown" }
) & { yarnColor: ColorInstance };
type BriefNotation = { reps: number; notation: PatternNotation };

const stitchCount = (
  notation: PatternNotation
): { uses: number; adds: number } => {
  switch (notation._t) {
    case "mr":
      return { uses: 0, adds: 1 };
    case "sc":
      return { uses: 1, adds: 1 };
    case "finish off":
    case "dec":
      return { uses: notation.num, adds: 1 };
    case "inc":
      return { uses: 1, adds: notation.num };
    case "ch":
    case "unknown":
      return { uses: 0, adds: 0 };
  }
};

const patternNotatoinEqual = (a: PatternNotation, b: PatternNotation) => {
  if (a.yarnColor != b.yarnColor) return false;
  switch (a._t) {
    case "inc":
    case "dec":
      return a._t == b._t && a.num == b.num;
    case "mr":
    case "ch":
    case "sc":
    case "finish off":
    case "unknown":
      return a._t == b._t;
  }
};

export const generatePattern = (stitches: Stitch[]): PatternNotation[] => {
  type Accumulator = {
    lastPost: null | Stitch;
    pattern: PatternNotation[];
    lastNotation: null | PatternNotation;
  };
  const res = stitches.reduce(
    ({ lastPost, pattern, lastNotation }, stitch): Accumulator => {
      const currLastPost = stitch.postStitches[stitch.postStitches.length - 1];
      const yarnColor = stitch.yarnColor;
      const patternForward = lastNotation
        ? [...pattern, lastNotation]
        : pattern;
      if (!stitch.prev) {
        return {
          lastPost: null,
          pattern: [],
          lastNotation: { _t: "mr", yarnColor },
        };
      } else if (currLastPost) {
        if (stitch.postStitches.length == 1) {
          if (currLastPost == lastPost) {
            switch (lastNotation?._t) {
              case "inc":
                return {
                  lastPost: currLastPost,
                  pattern,
                  lastNotation: {
                    _t: "inc",
                    num: lastNotation.num + 1,
                    yarnColor,
                  },
                };
              case "sc":
                return {
                  lastPost: currLastPost,
                  pattern,
                  lastNotation: {
                    _t: "inc",
                    num: 2,
                    yarnColor,
                  },
                };
            }
          } else if (currLastPost.prev == lastPost) {
            return {
              lastPost: currLastPost,
              pattern: patternForward,
              lastNotation: { _t: "sc", yarnColor },
            };
          }
        } else {
          if (
            stitch.postStitches.every((post, i) => {
              const prevPost = stitch.postStitches[i - 1];
              return prevPost ? post.prev == prevPost : post.prev == lastPost;
            })
          ) {
            return {
              lastPost: currLastPost,
              pattern: patternForward,
              lastNotation: {
                _t: "dec",
                num: stitch.postStitches.length,
                yarnColor,
              },
            };
          }
        }
      } else {
        return {
          lastPost,
          pattern: patternForward,
          lastNotation: { _t: "ch", yarnColor },
        };
      }
      return {
        lastPost,
        pattern: patternForward,
        lastNotation: { _t: "unknown", yarnColor },
      };
    },
    { lastPost: null, pattern: [], lastNotation: null } as Accumulator
  );
  return res.lastNotation ? [...res.pattern, res.lastNotation] : res.pattern;
};

export const patternNotationToString = (n: PatternNotation): string => {
  switch (n._t) {
    case "inc":
      return n.num == 2 ? "inc" : `${n.num} sc in 1`;
    case "dec":
      return n.num == 2 ? "dec" : `sc ${n.num} tog`;
    case "mr":
    case "ch":
    case "sc":
    case "finish off":
    case "unknown":
      return n._t;
  }
};

type Row = {
  pattern: PatternNotation[];
};

const rowStitchCount = (row: Row) =>
  row.pattern.map(stitchCount).reduce((sum, curr) => ({
    adds: sum.adds + curr.adds,
    uses: sum.uses + curr.uses,
  }));

export const splitIntoRows = (pattern: PatternNotation[]): Row[] => {
  type Accumulator = {
    finishedRows: Row[];
    currentRow: Row;
    unusedStitchCount: number;
  };
  const res = pattern.reduce(
    (
      { finishedRows, currentRow, unusedStitchCount },
      notation
    ): Accumulator => {
      const { uses } = stitchCount(notation);
      const newCurrRow = { pattern: [...currentRow.pattern, notation] };
      if (unusedStitchCount - uses <= 0) {
        return {
          finishedRows: [...finishedRows, newCurrRow],
          currentRow: { pattern: [] },
          unusedStitchCount:
            unusedStitchCount - uses + rowStitchCount(newCurrRow).adds,
        };
      } else {
        return {
          finishedRows,
          currentRow: newCurrRow,
          unusedStitchCount: unusedStitchCount - uses,
        };
      }
    },
    {
      finishedRows: [],
      currentRow: { pattern: [], stitchCount: 0 },
      unusedStitchCount: 0,
    } as Accumulator
  );
  return res.currentRow.pattern.length == 0
    ? res.finishedRows
    : [...res.finishedRows, res.currentRow];
};

export const briefRow = (row: Row) => {
  const briefPattern = row.pattern.reduce((acc, notation): BriefNotation[] => {
    const lastAbbrev = acc[acc.length - 1];
    if (lastAbbrev && patternNotatoinEqual(lastAbbrev.notation, notation))
      return [
        ...acc.slice(0, acc.length - 1),
        { ...lastAbbrev, reps: lastAbbrev.reps + 1 },
      ];
    return [...acc, { reps: 1, notation: notation }];
  }, [] as BriefNotation[]);
  return { briefPattern, stitchCount: rowStitchCount(row).adds };
};
