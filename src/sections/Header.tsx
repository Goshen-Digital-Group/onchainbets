// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from "gamba-react-ui-v2";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Modal } from "../components/Modal";
import LeaderboardsModal from "../sections/LeaderBoard/LeaderboardsModal";
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from "../constants";
import { useMediaQuery } from "../hooks/useMediaQuery";
import TokenSelect from "./TokenSelect";
import { UserButton } from "./UserButton";
import { ENABLE_LEADERBOARD } from "../constants";
import Jackpot from "../components/Jackpot";

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  color: #000000ff;
  background: rgba(0, 255, 42, 0.33);
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.2s;
  &:hover {
    background: white;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background: #00000017;
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img {
    height: 120%;
  }
`;

const MobileMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MobileMenuButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  background: rgba(255, 217, 0, 0.1);
  color: #000000ff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const JackpotBonus = styled(Bonus)`
  font-size: 16px;
  padding: 10px 18px;
  font-weight: bold;
  color: #222;
  background: linear-gradient(135deg, #00ff37ff, #00ff0dff);
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 34, 0.8);
  letter-spacing: 1px;

  &:hover,
  &:focus {
    background: linear-gradient(135deg, #00ff0dff, #00ff37ff);
    transform: translateY(-3px) scale(1.08);
    outline: none;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 7px 10px;
    border-radius: 8px;
  }
`;

const MobileMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0, 85, 25, 1);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 200px;
  z-index: 1001;
  margin-top: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  a {
    color: #ffffff;
    text-decoration: none;
    padding: 8px 0;
    font-weight: normal;
    transition: color 0.2s;

    &:hover {
      color: #00ff37ff;
    }
  }
`;

export default function Header() {
  const pool = useCurrentPool();
  const context = useGambaPlatformContext();
  const balance = useUserBalance();
  const isDesktop = useMediaQuery("lg");
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [bonusHelp, setBonusHelp] = React.useState(false);
  const [jackpotHelp, setJackpotHelp] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false); // Add this state

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have{" "}
            <b>
              <TokenValue amount={balance.bonusBalance} />
            </b>{" "}
            worth of free plays. This bonus will be applied automatically when
            you play.
          </p>
          <p>Note that a fee is still needed from your wallet for each play.</p>
        </Modal>
      )}

      {jackpotHelp && <Jackpot onClose={() => setJackpotHelp(false)} />}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <StyledHeader>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Logo to="/">
            <img alt="BETS logo" src="/logo.svg" />
          </Logo>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Desktop Navigation */}
          {isDesktop ? (
            <>
              {pool.jackpotBalance > 0 && (
                <JackpotBonus
                  onClick={() => setJackpotHelp(true)}
                  aria-label="Jackpot info"
                >
                  💰
                  <TokenValue amount={pool.jackpotBalance} />
                </JackpotBonus>
              )}

              {balance.bonusBalance > 0 && (
                <Bonus
                  onClick={() => setBonusHelp(true)}
                  aria-label="Bonus info"
                >
                  ✨
                  <TokenValue amount={balance.bonusBalance} />
                </Bonus>
              )}
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>
              <TokenSelect />
              <UserButton />
            </>
          ) : (
            // Mobile Navigation
            <MobileMenu>
              <TokenSelect />
              <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
                <span>☰</span>
              </MobileMenuButton>
              {mobileMenuOpen && (
                <Modal onClose={() => setMobileMenuOpen(false)}>
                  <MobileMenuDropdown
                    style={{
                      position: "static",
                      marginTop: 0,
                      background:
                        "linear-gradient(135deg, #001f0f 0%, #003d1f 100%)",
                      borderRadius: "18px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                      border: "2px solid #00ff37",
                      padding: "0",
                      maxWidth: "340px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px 0",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "80%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <UserButton />
                      </div>
                    </div>
                    {pool.jackpotBalance > 0 && (
                      <div
                        style={{
                          width: "80%",
                          margin: "0 auto",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <JackpotBonus
                          onClick={() => {
                            setJackpotHelp(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          💰
                          <TokenValue amount={pool.jackpotBalance} />
                        </JackpotBonus>
                      </div>
                    )}

                    {balance.bonusBalance > 0 && (
                      <Bonus
                        onClick={() => setBonusHelp(true)}
                        aria-label="Bonus info"
                      >
                        ✨
                        <TokenValue amount={balance.bonusBalance} />
                      </Bonus>
                    )}
                    <GambaUi.Button
                      onClick={() => {
                        setShowLeaderboard(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Leaderboard
                    </GambaUi.Button>
                  </MobileMenuDropdown>
                </Modal>
              )}
            </MobileMenu>
          )}
        </div>
      </StyledHeader>
    </>
  );
}
