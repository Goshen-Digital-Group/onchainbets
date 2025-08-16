import React from "react";
import styled from "styled-components";
import { SlideSection } from "../../components/Slider";
import { GAMES } from "../../games";
import { GameCard } from "./GameCard";
// src/sections/Dashboard/Dashboard.tsx
import FeaturedInlineGame from "./FeaturedInlineGame";
import { EnhancedTickerTape } from "../../components/EnhancedTickerTape";

export function GameSlider() {
  return (
    <SlideSection>
      {GAMES.map((game) => (
        <div key={game.id} style={{ width: "160px", display: "flex" }}>
          <GameCard game={game} />
        </div>
      ))}
    </SlideSection>
  );
}

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export function GameGrid() {
  return (
    <Grid>
      {GAMES.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Grid>
  );
}

export default function Dashboard() {
  return (
    <>
      <EnhancedTickerTape />
      <FeaturedInlineGame />
      <h1
        style={{
          textAlign: "center",
          color: "#fff",
          fontSize: "50px",
          textShadow: "0 0 24px #000, 0 0 24px #000, 0 0 24px #000",
        }}
      >
        Games
      </h1>
      <GameGrid />
    </>
  );
}
