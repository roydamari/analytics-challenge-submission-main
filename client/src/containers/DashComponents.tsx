import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import styled from "styled-components";
export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

export const TileContainer = styled.div`
  /* margin-top:-10vh; */
  display: flex;
  flex-direction: row;
  z-index: 1000;
  flex-wrap: wrap;
  background-color: wheat;
  width: 190vw;
  width: 100%;
  height: fit-content;
  padding: 1%;
`;
interface TileProps {
  wide?: true;
}

export const Tile = styled.div<TileProps>`
  min-width: ${(props) => (props.wide ? "98%" : "320px")};

  overflow: hidden;
  height: 400px;
  margin: 1vw;
  /* margin-bottom:2vh; */
  background-color: white;
  border-radius: 10px;
`;
