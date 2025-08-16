import { useEffect, useState, useCallback, useRef } from "react";

// Reusable throttle hook
function useThrottle(callback: () => void, delay: number) {
  const lastCall = useRef(0);
  return () => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback();
    }
  };
}
import { useCurrentPool, useCurrentToken } from "gamba-react-ui-v2";
import ReactDOM from "react-dom";
import { FAKE_TOKEN_MINT } from "gamba-react-ui-v2";
import styled, { keyframes } from "styled-components";
import React from "react";

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #00ff0d44;
  }
  100% { 
    box-shadow: 0 0 48px #00ff0dcc, 0 0 96px #a259ff88;
    border-color: #09ff00aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const StatusButton = styled.button<{ $hovered: boolean }>`
  background: rgba(0, 255, 34, 0.1);
  border: 2px solid rgba(0, 255, 21, 0.3);
  color: #2bff00ff;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  @media (max-width: 600px) {
    padding: 0.6rem 0.9rem;
    font-size: 1rem;
    border-radius: 10px;
    min-width: 110px;
  }
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 0, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: #09ff00ff;
    box-shadow: 0 0 20px rgba(51, 255, 0, 0.4);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  ${({ $hovered }) =>
    $hovered &&
    `
    border-color: #15ff00ff;
    box-shadow: 0 0 20px rgba(0, 255, 21, 0.4);
    transform: translateY(-2px);
  `}
`;

const StatusModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContentStyled = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 2px solid rgba(0, 255, 34, 0.3);
  padding: 1.1rem 1rem;
  max-width: 380px;
  margin: 100px auto 0 auto;
  width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 0 40px rgba(0, 255, 34, 0.12);
  animation: ${neonPulse} 3s ease-in-out infinite alternate;
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
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }
  @media (max-width: 600px) {
    padding: 0.75rem 0.5rem;
    margin: 60px 0.25rem 0.25rem 0.25rem;
    max-width: 98vw;
    border-radius: 10px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: #00ff0dff;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px #00ff0dff, 0 0 20px #15ff00ff,
    2px 2px 4px rgba(0, 0, 0, 0.8);
  position: relative;
  &::before {
    content: "🔌";
    position: absolute;
    left: -2.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: ${sparkle} 2s ease-in-out infinite;
  }
  &::after {
    content: "⚡";
    position: absolute;
    right: -2.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: ${sparkle} 2s ease-in-out infinite 0.5s;
  }
`;

const StatusItem = styled.div<{
  status: "Online" | "Issues" | "Offline" | "Secured" | "Unsecured" | "Loading";
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(30, 255, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  .label {
    font-weight: bold;
    color: #00ff00ff;
    text-shadow: 0 0 5px rgba(0, 255, 13, 0.5);
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 8px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.8rem;

    ${({ status }) => {
      switch (status) {
        case "Online":
        case "Secured":
          return `
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
          `;
        case "Issues":
        case "Loading":
          return `
            background: rgba(234, 179, 8, 0.2);
            color: #eab308;
            border: 1px solid rgba(234, 179, 8, 0.3);
            box-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
          `;
        case "Offline":
        case "Unsecured":
          return `
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
          `;
      }
    }}
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid rgba(0, 255, 13, 0.3);
  color: #00ff22ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }
`;

const CUSTOM_RPC = import.meta.env.VITE_RPC_ENDPOINT;
const PLATFORM_CREATOR = import.meta.env.VITE_PLATFORM_CREATOR;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function ConnectionStatus() {
  const [showModal, setShowModal] = useState(false);
  const [rpcHealth, setRpcHealth] = useState({ isHealthy: false });
  const [rpcPing, setRpcPing] = useState<number | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "Secured" | "Unsecured" | "Loading" | null
  >("Loading");
  const [lastTxTime, setLastTxTime] = useState<string | null>(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const pool = useCurrentPool();
  const token = useCurrentToken();

  // --- Throttle delay ---
  const THROTTLE_MS = 10000; // 10 seconds

  // Ping + Health check (only when modal is open, singular, throttled)
  const throttledHealthCheck = useThrottle(async () => {
    const start = performance.now();
    try {
      const res = await fetch(CUSTOM_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth" }),
      });
      const elapsed = performance.now() - start;
      setRpcPing(Math.round(elapsed));
      const data = await res.json();
      setRpcHealth({ isHealthy: data.result === "ok" });
    } catch {
      setRpcPing(null);
      setRpcHealth({ isHealthy: false });
    }
  }, THROTTLE_MS);

  // Last transaction + status check (only when modal is open, singular, throttled)
  const throttledTxCheck = useThrottle(async () => {
    if (!PLATFORM_CREATOR) return;
    try {
      const res = await fetch(
        `https://api.helius.xyz/v0/addresses/${PLATFORM_CREATOR}/transactions?api-key=${API_KEY}&limit=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const tx = data[0];
        setTransactionStatus("Secured");
        const date = new Date(tx.timestamp * 1000);
        setLastTxTime(date.toLocaleString());
      } else {
        setTransactionStatus("Unsecured");
        setLastTxTime(null);
      }
    } catch (err) {
      console.error("Transaction fetch failed:", err);
      setTransactionStatus("Unsecured");
      setLastTxTime(null);
    }
  }, THROTTLE_MS);

  useEffect(() => {
    if (!showModal) return;
    throttledHealthCheck();
    throttledTxCheck();
    // Optionally, set up polling if you want repeated checks while modal is open:
    const interval = setInterval(() => {
      throttledHealthCheck();
      throttledTxCheck();
    }, THROTTLE_MS);
    return () => clearInterval(interval);
  }, [showModal, throttledHealthCheck, throttledTxCheck]);

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sessionType =
    token?.mint && token.mint.equals(FAKE_TOKEN_MINT) ? "Free Play" : "Live";

  // Determine status light color based on all checks
  let statusLightColor = "#ff4d4f"; // default red
  const isLoading =
    transactionStatus === "Loading" || rpcHealth.isHealthy === undefined;

  useEffect(() => {
    console.log(
      `✅ RPC Health Status: ${rpcHealth.isHealthy ? "Healthy" : "Unhealthy"}`
    );
    console.log(
      `📶 RPC Ping Time: ${rpcPing !== null ? rpcPing + " ms" : "Unavailable"}`
    );
    console.log(`🔄 Transaction Status: ${transactionStatus || "Unknown"}`);
    console.log(
      `🕒 Recent Transaction: ${lastTxTime ?? "No recent transactions"}`
    );
    console.log(
      `🏊 Pool Address: ${pool?.publicKey?.toBase58() ?? "Not connected"}`
    );
    console.log(`💰 Token Name: ${token?.name ?? "N/A"}`);
    console.log(`🎮 Session Type: ${sessionType}`);
  }, [
    rpcHealth,
    rpcPing,
    transactionStatus,
    lastTxTime,
    pool,
    token,
    sessionType,
  ]);

  const ModalContent = (
    <StatusModal role="dialog" aria-modal="true">
      <div style={{ pointerEvents: "auto" }}>
        <CloseButton aria-label="Close" onClick={() => setShowModal(false)}>
          ×
        </CloseButton>
        <ModalContentStyled>
          <ModalTitle>Connection Status</ModalTitle>

          <StatusItem status={transactionStatus || "Loading"}>
            <span className="label">🔒 Transactions:</span>
            <span className="status">{transactionStatus}</span>
          </StatusItem>

          {lastTxTime && (
            <StatusItem status="Online">
              <span className="label">⏰ Recent Transaction:</span>
              <span style={{ fontSize: "0.8rem", color: "#ccc" }}>
                {lastTxTime}
              </span>
            </StatusItem>
          )}

          <StatusItem status={rpcHealth.isHealthy ? "Online" : "Offline"}>
            <span className="label">🌐 RPC Health:</span>
            <span className="status">
              {rpcHealth.isHealthy ? "Healthy" : "Unhealthy"}
            </span>
          </StatusItem>

          {rpcPing !== null && (
            <StatusItem status={rpcPing < 500 ? "Online" : "Issues"}>
              <span className="label">⚡ RPC Ping:</span>
              <span className="status">{rpcPing}ms</span>
            </StatusItem>
          )}

          {pool && (
            <StatusItem status="Online">
              <span className="label">🏊 Pool:</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#ccc",
                  fontFamily: "monospace",
                }}
              >
                {pool.publicKey?.toBase58().slice(0, 8)}...
              </span>
            </StatusItem>
          )}

          {token && (
            <StatusItem status="Online">
              <span className="label">💰 Token:</span>
              <span className="status">{token.name}</span>
            </StatusItem>
          )}
        </ModalContentStyled>
      </div>
    </StatusModal>
  );

  return (
    <div style={{ display: "inline-block" }}>
      <StatusButton
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        $hovered={buttonHovered}
      >
        🔌 Connection Status
      </StatusButton>

      {showModal && ReactDOM.createPortal(ModalContent, document.body)}
    </div>
  );
}
