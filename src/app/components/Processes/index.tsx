import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Zoom from "@material-ui/core/Zoom";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";

import { IMonitor } from "../../Store";

import "./index.css";

interface IProps {
  monitor: IMonitor;
  onClose: () => void;
}

const initialCommands = [
  "yarn install",
  "yarn sequelize db:migrate",
  "cd ios && pod install",
  "yarn build",
  "yarn migrate transactions:up",
  "yarn run:ios",
  "yarn test",
];

const Processes: React.FC<IProps> = (props) => {
  const [commands, setCommands] = React.useState(initialCommands);
  const [runningCommand, setRunningCommand] = React.useState<number | null>(
    null
  );
  const [commandSuccess, setCommandSuccess] = React.useState<null | string>(
    null
  );

  const [logs, setLogs] = React.useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs((oldLogs) => [...oldLogs, log]);
  };

  const runCommand = (command: string, idx: number) => {
    setRunningCommand(idx);
    setTimeout(() => {
      addLog("yarn install v1.22.17");
    }, 1000);
    setTimeout(() => {
      addLog("[1/2] 🔍  Validating package.json...");
    }, 1250);
    setTimeout(() => {
      addLog("[2/2] 🔍  Resolving packages...");
    }, 2000);
    setTimeout(() => {
      addLog("success Already up-to-date.");
    }, 2500);
    setTimeout(() => {
      setRunningCommand(null);
      setLogs([]);
      setCommandSuccess(commands[idx]);
    }, 3000);
  };

  type SlideDirection = "right" | "up" | "down" | "left";
  const slideDirections: SlideDirection[] = ["right", "up", "down", "left"];

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={!!commandSuccess}
        autoHideDuration={4000}
        onClose={() => setCommandSuccess(null)}
        message="Command successfully run"
    />
      <Grid container spacing={3}>
        {commands.map((command, idx) => (
          <Slide
            in={runningCommand === null || runningCommand === idx}
            mountOnEnter
            unmountOnExit
            direction={slideDirections[idx % 4]}
          >
            <Grid item xs={3} key={command}>
              <Card>
                <CardContent>
                  <pre>{command}</pre>
                </CardContent>
                <CardActions>
                  <Button
                    disabled={runningCommand === idx}
                    onClick={() => runCommand(command, idx)}
                    variant="contained"
                    color="primary"
                  >
                    {runningCommand === idx ? "Running..." : "Run"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Slide>
        ))}
        {runningCommand !== null && (
          <Slide
            in={runningCommand !== null}
            mountOnEnter
            unmountOnExit
            direction="right"
          >
            <Grid xs={12}>
              <Box p={4}>
                <code>Running {commands[runningCommand!]}...</code>
                <br />
                {logs.map((log) => (
                  <>
                    <code>{log}</code>
                    <br />
                  </>
                ))}
              </Box>
            </Grid>
          </Slide>
        )}
      </Grid>
    </div>
  );
};

export default Processes;
