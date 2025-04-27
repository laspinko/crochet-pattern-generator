import { Stitch } from "./logic/graph";
import { Stack, Tab, Tabs } from "@mui/material";
import { ReactElement, useMemo, useState } from "react";
import { PatternTab } from "./components/PatternTab";
import { GenerateTab } from "./components/GenerateTab";
import { Visualiser } from "./components/Visualiser";

function App() {
  const [stitches, setStitches] = useState<Stitch[]>([]);

  type TabLabels = "generate" | "pattern";
  const tabs: { [K in TabLabels]: ReactElement } = {
    generate: <GenerateTab onStitchesChange={setStitches} />,
    pattern: <PatternTab stitches={stitches} />,
  };

  const [tab, setTab] = useState<TabLabels>("generate");

  return (
    <Stack direction="row" sx={{ width: "100%" }}>
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
        {tabs[tab]}
      </Stack>
    </Stack>
  );
}

export default App;
