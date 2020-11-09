import React, { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Tile, TileContainer } from "./DashComponents";
import {
  LogTile,
  Map,
  PieTile,
  Retention,
  SessionsDays,
  SessionsHours,
} from "../components/analytics";
const DashBoard: React.FC = () => {
  return (
    <TileContainer>
      <ErrorBoundary>
        <Tile wide>
          <Map />
        </Tile>
      </ErrorBoundary>
      <ErrorBoundary>
        <Tile>
          <Retention />
        </Tile>
      </ErrorBoundary>
      <ErrorBoundary>
        <Tile>
          <SessionsDays />
        </Tile>
      </ErrorBoundary>
      <ErrorBoundary>
        <Tile>
          <SessionsHours />
        </Tile>
      </ErrorBoundary>
      <ErrorBoundary>
        <Tile>
          <LogTile />
        </Tile>
      </ErrorBoundary>
      <ErrorBoundary>
        <Tile>
          <PieTile />
        </Tile>
      </ErrorBoundary>
    </TileContainer>
  );
};

export default DashBoard;
