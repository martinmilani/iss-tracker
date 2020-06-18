import React from "react"
import TrackMap from "./components/TrackMap"


import { Container, AppBar, Toolbar, Typography } from "@material-ui/core"

require('dotenv').config();


function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            ISS Live Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth='lg'  >
        <TrackMap />
      </Container>
    </div>

  );
}

export default App