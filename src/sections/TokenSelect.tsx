import { PublicKey } from "@solana/web3.js";
import {
  FAKE_TOKEN_MINT,
  GambaPlatformContext,
  GambaUi,
  PoolToken,
  TokenValue,
  useCurrentToken,
  useTokenBalance,
  useTokenMeta,
} from "gamba-react-ui-v2";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Dropdown } from "../components/Dropdown";
import { Modal } from "../components/Modal";
import { POOLS } from "../constants";
import { useUserStore } from "../hooks/useUserStore";

const StyledToken = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  img {
    height: 20px;
  }
`;

const StyledTokenImage = styled.img`
  height: 20px;
  aspect-ratio: 1/1;
  border-radius: 50%;
`;

const StyledTokenButton = styled.button`
  box-sizing: border-box;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
  &:hover {
    background: #00ff22af;
  }
`;

const FloatingReminder = styled.div`
  position: absolute; /* Position relative to the button's container */
  top: 100%; /* Position it below the button */
  left: 50%; /* Center it horizontally relative to the button */
  transform: translateX(-50%) translateY(10px); /* Add spacing below the button */
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  /* Add a small arrow pointing up to the button */
  &::after {
    content: "";
    position: absolute;
    top: -6px; /* Position the arrow above the reminder */
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #000 transparent; /* Arrow pointing up */
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    transform: translateX(-50%) translateY(8px); /* Adjust spacing for smaller screens */
  }
`;

function TokenImage({ mint, ...props }: { mint: PublicKey }) {
  const meta = useTokenMeta(mint);
  return <StyledTokenImage src={meta.image} {...props} />;
}

function TokenSelectItem({ mint }: { mint: PublicKey }) {
  const balance = useTokenBalance(mint);
  return (
    <>
      <TokenImage mint={mint} />{" "}
      <TokenValue mint={mint} amount={balance.balance} />
    </>
  );
}

export default function TokenSelect() {
  const [visible, setVisible] = React.useState(false);
  const [warning, setWarning] = React.useState(false);
  const [showReminder, setShowReminder] = React.useState(true); // State to control the floating reminder
  const [allowRealPlays, setAllowRealPlays] = React.useState(false);
  const context = React.useContext(GambaPlatformContext);
  const selectedToken = useCurrentToken();
  const userStore = useUserStore();
  const balance = useTokenBalance();

  // Update the platform context with the last selected token from localStorage
  useEffect(() => {
    if (userStore.lastSelectedPool) {
      context.setPool(
        userStore.lastSelectedPool.token,
        userStore.lastSelectedPool.authority
      );
    }
  }, []);

  // Read real-play override – enables SOL selection on deployed builds when needed
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q =
        params.get("allowReal") ||
        params.get("real") ||
        params.get("realplays");
      if (q != null) {
        const v = q === "1" || q === "true";
        localStorage.setItem("allowRealPlays", v ? "1" : "0");
      }
      const saved = localStorage.getItem("allowRealPlays");
      setAllowRealPlays(saved === "1");
    } catch {}
  }, []);

  // Hide the floating reminder after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReminder(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const selectPool = (pool: PoolToken) => {
    setVisible(false);
    // Check if platform has real plays disabled
    const realDisabled =
      Boolean(import.meta.env.VITE_REAL_PLAYS_DISABLED) && !allowRealPlays;
    if (realDisabled && !pool.token.equals(FAKE_TOKEN_MINT)) {
      setWarning(true);
      return;
    }
    // Update selected pool
    context.setPool(pool.token, pool.authority);
    userStore.set({
      lastSelectedPool: {
        token: pool.token.toString(),
        authority: pool.authority?.toString(),
      },
    });
  };

  const click = () => {
    setVisible(!visible);
  };

  return (
    <>
      {warning && (
        <Modal>
          <h1>Real plays disabled</h1>
          <p>This platform only allows you to play with fake tokens.</p>
          <GambaUi.Button main onClick={() => setWarning(false)}>
            Okay
          </GambaUi.Button>
        </Modal>
      )}
      <div style={{ position: "relative" }}> {/* Ensure the parent container is relative */}
        {showReminder && <FloatingReminder>You can select available tokens here</FloatingReminder>}
        <GambaUi.Button onClick={click}>
          {selectedToken && (
            <StyledToken>
              <TokenImage mint={selectedToken.mint} />
              <TokenValue amount={balance.balance} />
            </StyledToken>
          )}
        </GambaUi.Button>
        <Dropdown visible={visible}>
          {visible &&
            POOLS.map((pool, i) => (
              <StyledTokenButton onClick={() => selectPool(pool)} key={i}>
                <TokenSelectItem mint={pool.token} />
              </StyledTokenButton>
            ))}
        </Dropdown>
      </div>
    </>
  );
}
