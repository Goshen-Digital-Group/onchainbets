import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  useReferral,
  useTokenBalance,
  useCurrentToken,
  GambaUi,
} from "gamba-react-ui-v2";
import React, { useState } from "react";
import { Modal } from "../components/Modal";
import {
  PLATFORM_ALLOW_REFERRER_REMOVAL,
  PLATFORM_REFERRAL_FEE,
} from "../constants";
import { useToast } from "../hooks/useToast";
import { useUserStore } from "../hooks/useUserStore";
import { truncateString } from "../utils";
import styled, { keyframes, css } from "styled-components";
// Neon button style matching Jackpot
const NeonUserButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: relative;
  transition: background 0.2s, box-shadow 0.2s;
  font-weight: bold;
  color: #fff;
  letter-spacing: 0.5px;
`;
import ConnectionStatus from "../components/ConnectionStatus";

export const neonPulse = keyframes`
  0% { box-shadow: 0 0 24px #00ff37aa, 0 0 48px #00ff0daa; border-color: #00ff37aa; }
  100% { box-shadow: 0 0 48px #00ff37cc, 0 0 96px #00ff0dcc; border-color: #00ff0dcc; }
`;

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const ModalContent = styled.div`
  max-width: 380px;
  margin: 100px auto 0 auto;
  padding: 1.1rem 1rem;
  border-radius: 18px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 34, 0.3);
  color: white;
  position: relative;
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

function UserModal() {
  const user = useUserStore();
  const wallet = useWallet();
  const toast = useToast();
  const walletModal = useWalletModal();
  const referral = useReferral();
  const [removing, setRemoving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { balance, bonusBalance } = useTokenBalance();
  const currentToken = useCurrentToken();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const copyInvite = () => {
    try {
      referral.copyLinkToClipboard();
      toast({
        title: "📋 Copied to clipboard",
        description: "Your referral code has been copied!",
      });
    } catch {
      walletModal.setVisible(true);
    }
  };

  const removeInvite = async () => {
    try {
      setRemoving(true);
      await referral.removeInvite();
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Modal onClose={() => user.set({ userModal: false })}>
      <ModalContent>
        <h1
          style={{
            textAlign: "center",
            color: "#00ff0dff",
            marginBottom: "1rem",
          }}
        >
          {truncateString(wallet.publicKey?.toString() ?? "", 6, 3)}
        </h1>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            width: "100%",
            padding: "0 10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <GambaUi.Button main onClick={copyInvite}>
              💸 Copy invite link
            </GambaUi.Button>
            <div style={{ opacity: ".8", fontSize: "80%" }}>
              Share your link with new users to earn{" "}
              {PLATFORM_REFERRAL_FEE * 100}% every time they play on this
              platform.
            </div>
          </div>
          {PLATFORM_ALLOW_REFERRER_REMOVAL && referral.referrerAddress && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <GambaUi.Button disabled={removing} onClick={removeInvite}>
                Remove invite
              </GambaUi.Button>
              <div style={{ opacity: ".8", fontSize: "80%" }}>
                {!removing ? (
                  <>
                    You were invited by{" "}
                    <a
                      target="_blank"
                      href={`https://solscan.io/account/${referral.referrerAddress.toString()}`}
                      rel="noreferrer"
                    >
                      {truncateString(
                        referral.referrerAddress.toString(),
                        6,
                        6
                      )}
                    </a>
                    .
                  </>
                ) : (
                  <>Removing invite...</>
                )}
              </div>
            </div>
          )}
          <div
            style={{
              background: "rgba(24, 24, 24, 0.8)",
              borderRadius: "12px",
              padding: "1rem",
              margin: "1rem 0",
              boxShadow: "0 0 32px rgba(0, 255, 34, 0.12)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <label
                htmlFor="balance"
                style={{
                  color: "#00ff0dff",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                💰 Token and Bonus Balance
              </label>
            </div>
            <p
              style={{ color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}
            >
              <b style={{ color: "#00ff0dff" }}>Token Balance:</b>{" "}
              {(balance / Math.pow(10, currentToken?.decimals ?? 0)).toFixed(2)}
              {currentToken?.symbol ? ` ${currentToken.symbol}` : ""}
            </p>
            <p
              style={{ color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}
            >
              <b style={{ color: "#00ff0dff" }}>Bonus Balance:</b>{" "}
              {(
                bonusBalance / Math.pow(10, currentToken?.decimals ?? 0)
              ).toFixed(2)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem 0",
            }}
          >
            <ConnectionStatus />
          </div>
          <GambaUi.Button onClick={() => wallet.disconnect()}>
            Disconnect
          </GambaUi.Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function UserButton() {
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const user = useUserStore();

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  return (
    <>
      {wallet.connected && user.userModal && <UserModal />}
      <div style={{ position: "relative" }}>
        <NeonUserButton
          onClick={() =>
            wallet.connected ? user.set({ userModal: true }) : connect()
          }
        >
          {wallet.connected ? (
            <img
              src="/user.jpg"
              alt="User"
              style={{
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                objectFit: "cover",
                marginRight: "8px",
              }}
            />
          ) : (
            <span
              style={{
                color: "#000000ff",
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
                width: "100%",
              }}
            >
              Connect
            </span>
          )}
        </NeonUserButton>
      </div>
    </>
  );
}
