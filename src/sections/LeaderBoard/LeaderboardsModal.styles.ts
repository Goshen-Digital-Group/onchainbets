// src/components/LeaderboardsModal.styles.ts
import styled, { css } from "styled-components";

/* ───── Base modal‑content shell (identical to StakingModal) ───── */
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.1rem 1rem;
  width: 100%;
  max-width: 380px;
  margin: 100px auto 0 auto;
  border-radius: 18px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 34, 0.3);
  color: white;
  position: relative;
  box-shadow: 0 0 40px rgba(0, 255, 34, 0.12);
  animation: neonPulse 3s ease-in-out infinite alternate;
  max-height: calc(90vh - 4rem);
  overflow-y: auto;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 20% 20%,
        rgba(0, 255, 34, 0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(0, 255, 42, 0.08) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00ff37ff, #00ff0dff, #15ff00ff);
    background-size: 300% 100%;
    animation: moveGradient 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
    margin: 60px 0.25rem 0.25rem 0.25rem;
    max-width: 98vw;
    border-radius: 10px;
  }
`;

/* ───── Header ───── */
export const HeaderSection = styled.div`
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #a0a0a0;
  margin: 0;
`;

/* ───── Tabs (same palette as staking) ───── */
export const TabRow = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin: 0.5rem 0 1rem;
`;

export const TabButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #a0a0a0;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    ${({ $selected }) =>
      !$selected &&
      css`
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      `}
  }
  ${({ $selected }) =>
    $selected &&
    css`
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      font-weight: 600;
    `}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ───── Leaderboard list ───── */
export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
`;
export const HeaderRank = styled.div`
  flex: 0 0 50px;
  text-align: center;
`;
export const HeaderPlayer = styled.div`
  flex: 1;
  padding-left: 0.5rem;
`;
export const HeaderVolume = styled.div`
  flex: 0 0 100px;
  text-align: right;
`;

export const RankItem = styled.div<{ $isTop3?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
  ${({ $isTop3 }) => $isTop3 && css``}
`;

export const RankNumber = styled.div<{ rank: number }>`
  flex: 0 0 50px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  text-align: center;
  ${({ rank }) =>
    rank === 1 &&
    css`
      &:before {
        content: "🥇";
        margin-right: 0.5em;
        font-size: 1.1em;
      }
      color: #ffd700;
    `}
  ${({ rank }) =>
    rank === 2 &&
    css`
      &:before {
        content: "🥈";
        margin-right: 0.5em;
        font-size: 1.1em;
      }
      color: #c0c0c0;
    `}
  ${({ rank }) =>
    rank === 3 &&
    css`
      &:before {
        content: "🥉";
        margin-right: 0.5em;
        font-size: 1.1em;
      }
      color: #cd7f32;
    `}
`;
export const PlayerInfo = styled.div`
  flex: 1;
  padding-left: 0.5rem;
  font-size: 0.95rem;
  color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const VolumeAmount = styled.div`
  flex: 0 0 100px;
  text-align: right;
  font-size: 0.95rem;
  font-weight: 500;
  color: #03ffa4;
`;

/* ───── States & helpers ───── */
export const LoadingText = styled.p`
  text-align: center;
  color: #ccc;
  padding: 2rem 0;
`;
export const ErrorText = styled.p`
  text-align: center;
  color: #ff8080;
  padding: 2rem 0;
`;
export const EmptyStateText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0a0a0;
`;

export const formatVolume = (v: number): string =>
  typeof v !== "number" || isNaN(v)
    ? "$NaN"
    : v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
