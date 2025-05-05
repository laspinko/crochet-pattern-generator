import { buildPiece, recolour, Stitch } from "./logic/graph";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { PatternTab } from "./components/PatternTab";
import { GenerateTab } from "./components/GenerateTab";
import { Visualiser } from "./components/Visualiser";
import Color, { ColorInstance } from "color";

function App() {
  const [stitches, setStitches] = useState<Stitch[]>([]);

  const [yarnColors, setYarnColors] = useState<ColorInstance[]>([
    Color("white"),
    Color("blue"),
  ]);

  useEffect(() => {
    setStitches(recolour(stitches, yarnColors));
  }, [yarnColors]);

  type TabLabels = "generate" | "pattern";
  const tabs: { [K in TabLabels]: ReactElement } = {
    generate: (
      <GenerateTab
        onPointsChange={(points) =>
          setStitches(buildPiece(points, yarnColors, true))
        }
        onColorsChange={setYarnColors}
        yarnColors={yarnColors}
      />
    ),
    pattern: (
      <PatternTab
        stitches={stitches}
        yarnColors={yarnColors}
        onColorsChange={setYarnColors}
      />
    ),
  };

  const [tab, setTab] = useState<TabLabels>("generate");

  return (
    <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
      <Visualiser stitches={stitches} />
      <Stack
        spacing={2}
        padding={2}
        sx={{
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        <Tabs value={tab}>
          <Tab
            label={"Generate"}
            value={"generate"}
            onClick={() => setTab("generate")}
          />
          <Tab
            label={"Pattern"}
            value={"pattern"}
            onClick={() => setTab("pattern")}
          />
        </Tabs>
        {Object.entries(tabs).map(([label, el]) => (
          <Box sx={{ display: label == tab ? undefined : "none" }}>{el}</Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default App;
