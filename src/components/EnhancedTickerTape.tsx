
import React, { useState, useEffect, useMemo } from "react";
import { useTokenPrices } from "../hooks/useTokenPrices";
import styled, { keyframes, css } from "styled-components";
import { useTokenPriceService } from "../hooks/useTokenPriceService";

// Ticker animation
const tickerMove = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// Pulse animation for significant changes
const pricePulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

// Glow animation for hot tokens
const priceGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px #ffd70033; }
  50% { box-shadow: 0 0 16px #ffd700aa, 0 0 24px #ffd70066; }
`;

const TokenItem = styled.span<{
  $hasChange?: boolean;
  $isIncreasing?: boolean;
  $isSignificant?: boolean;
  $isLiveData?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 1.2rem 0.2rem 0.2rem;
  border-radius: 1.2rem;
  background: rgba(24, 24, 24, 0.5);
  position: relative;
  transition: all 0.3s ease;

  ${(props) =>
    props.$hasChange &&
    css`
      animation: ${pricePulse} 2s ease-in-out;
    `}

  ${(props) =>
    props.$isSignificant &&
    css`
      animation: ${priceGlow} 2s infinite, ${pricePulse} 2s ease-in-out;
      border: 1px solid ${props.$isIncreasing ? "#22c55e" : "#ef4444"};
    `}
  
  ${(props) =>
    !props.$isLiveData &&
    css`
      border: 1px solid rgba(30, 255, 0, 0.3);
    `}
  
  box-shadow: 0 0 8px #15ff0033;

  @media (max-width: 600px) {
    gap: 0.2rem;
    padding: 0.2rem 0.7rem 0.2rem 0.2rem;
  }
`;

export function EnhancedTickerTape() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Use the existing Gamba hook for basic token data
  const tokenMetadata = useTokenPrices();

  // Use our enhanced service for source information
  const { getTokenPriceData } = useTokenPriceService();

  // Track price history for change detection
  const [priceHistory, setPriceHistory] = useState<
    Record<
      string,
      {
        price: number;
        timestamp: number;
        previousPrice?: number; // Add previous price for comparison
      }
    >
  >({});

  // Update price history when tokenMetadata changes
  useEffect(() => {
    if (!tokenMetadata) return;

    tokenMetadata.forEach((token: any) => {
      const mintAddress = token.mint.toBase58();
      const currentPrice = token.usdPrice || 0;

      setPriceHistory((prev) => {
        const existing = prev[mintAddress];
        if (!existing || existing.price !== currentPrice) {
          return {
            ...prev,
            [mintAddress]: {
              price: currentPrice,
              timestamp: Date.now(),
              previousPrice: existing?.price || currentPrice, // Store previous for comparison
            },
          };
        }
        return prev;
      });
    });
  }, [tokenMetadata]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTokenItem = (token: any, key: string) => {
    const mintAddress = token.mint.toBase58();
    const currentPrice = token.usdPrice || 0;

    // Get enhanced price data from our service
    const priceData = getTokenPriceData(mintAddress);
    const isLiveData = priceData?.isLivePrice || false;
    const dataSource = priceData?.source || "fallback";

    // Check price history for change detection
    const priceEntry = priceHistory[mintAddress];
    const hasRecentChange =
      priceEntry && Date.now() - priceEntry.timestamp < 5 * 60 * 1000; // 5 minutes

    // Calculate price change using stored previous price
    let priceChange = 0;
    let isIncreasing = false;
    if (
      priceEntry &&
      priceEntry.previousPrice &&
      priceEntry.previousPrice > 0 &&
      currentPrice > 0
    ) {
      priceChange =
        ((currentPrice - priceEntry.previousPrice) / priceEntry.previousPrice) *
        100;
      isIncreasing = priceChange > 0;
    }

    const isSignificantChange = Math.abs(priceChange) > 2; // 2% or more
    const isTrending = currentPrice > 1; // Simple trending logic

    const dexUrl = `https://dexscreener.com/solana/${mintAddress}`;
    return (
      <a
        key={key}
        href={dexUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <TokenItem
          $hasChange={!!hasRecentChange && Math.abs(priceChange) > 0.1}
          $isIncreasing={!!isIncreasing}
          $isSignificant={!!isSignificantChange}
          $isLiveData={!!isLiveData}
          title={`${token.symbol} - ${
            isLiveData ? "Live API data" : "Fallback data"
          } | Change: ${priceChange.toFixed(2)}%`}
        >
          <TokenImage src={token.image} alt={token.symbol} />
          {!isMobile && <span>{token.symbol}</span>}
          <PriceDisplay
            $isIncreasing={!!isIncreasing}
            $hasChange={!!hasRecentChange && Math.abs(priceChange) > 0.1}
          >
            {token.minted === false
              ? "Coming Soon"
              : currentPrice > 0
              ? `$${currentPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}`
              : "N/A"}
          </PriceDisplay>

          {/* Show price change arrows and percentage */}
          {hasRecentChange && Math.abs(priceChange) > 0.1 && (
            <ChangeIndicator $isIncreasing={!!isIncreasing}>
              {isIncreasing ? "↗" : "↘"} {Math.abs(priceChange).toFixed(1)}%
            </ChangeIndicator>
          )}

          {/* Small data source indicator in corner */}
          {isLiveData && (
            <DataSourceBadge
              $isLive={true}
              style={{ fontSize: "10px", padding: "1px 3px" }}
            >
              LIVE
            </DataSourceBadge>
          )}

          {/* Show trending fire for "hot" tokens */}
          {isTrending && <TrendingBadge>🔥</TrendingBadge>}
        </TokenItem>
      </a>
    );
  };

  return (
    <TickerTapeWrapper
      style={
        isMobile
          ? { overflowX: "auto", overflowY: "hidden", height: "56px" }
          : { height: "56px" }
      }
    >
      {isMobile ? (
        <MobileTickerWrapper>
          <div className="mobile-ticker-spacer" />
          <TickerContentMobileAnimated>
            {tokenMetadata?.map((token: any) =>
              renderTokenItem(token, token.mint.toBase58())
            )}
          </TickerContentMobileAnimated>
          <div className="mobile-ticker-spacer" />
        </MobileTickerWrapper>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginBottom: "4px",
            }}
          >
            {/* Top Centered Content (optional, e.g. label) */}
          </div>
          <TickerContent style={{ justifyContent: "center", width: "100%" }}>
            {tokenMetadata?.map((token: any) =>
              renderTokenItem(token, token.mint.toBase58())
            )}
          </TickerContent>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "4px",
            }}
          >
            {/* Bottom Centered Content (optional) */}
          </div>
        </div>
      )}
    </TickerTapeWrapper>
  );
}

// Styled Components
const MobileTickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px 0;
  box-sizing: border-box;

  .mobile-ticker-spacer {
    height: 12px;
    width: 100%;
  }
`;

const TickerTapeWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  background: rgba(34, 34, 34, 0.85);
  border-radius: 0.7rem;
  border: 1px solid #00ff0044;
  margin-bottom: 1.2rem;
  position: relative;
  box-shadow: 0 0 16px #1eff0022;

  @media (max-width: 600px) {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #00ff22ff #222;
  }

  &::-webkit-scrollbar {
    height: 6px;
    background: #222;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #09ff00ff;
    border-radius: 4px;
  }
`;

const TickerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 3.5rem;
  white-space: nowrap;
  will-change: transform;
  font-size: 1.1rem;
  color: #09ff00ff;
  animation: ${tickerMove} 18s linear infinite;
  &:hover {
    animation-play-state: paused;
  }
`;

const TickerContentMobileAnimated = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  white-space: nowrap;
  font-size: 1.1rem;
  color: #09ff00ff;
  min-width: max-content;
  width: fit-content;
  padding: 0.2rem 0.2rem 0.2rem 0.4rem;
  animation: ${tickerMove} 18s linear infinite;
  &:hover {
    animation-play-state: paused;
  }
`;
const TokenImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  margin-right: 0.4rem;
`;

const PriceDisplay = styled.span<{
  $isIncreasing?: boolean;
  $hasChange?: boolean;
}>`
  margin-left: 6px;
  font-weight: 700;
  color: ${(props) =>
    props.$hasChange ? (props.$isIncreasing ? "#22c55e" : "#ef4444") : "#fff"};
  transition: color 2s ease;
`;

const ChangeIndicator = styled.span<{ $isIncreasing: boolean }>`
  font-size: 0.8rem;
  margin-left: 4px;
  color: ${(props) => (props.$isIncreasing ? "#22c55e" : "#ef4444")};
  font-weight: 600;
`;

const DataSourceBadge = styled.span<{ $isLive: boolean }>`
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 8px;
  background: ${(props) => (props.$isLive ? "#22c55e" : "#00ff4cff")};
  color: #fff;
  border-radius: 6px;
  padding: 1px 3px;
  font-weight: 700;
  opacity: 0.8;
`;

const TrendingBadge = styled.span`
  position: absolute;
  left: 15px;
  top: -10px;
  font-size: 12px;
  background: linear-gradient(45deg, #fffb00ff, #ff6b35);
  color: #000;
  border-radius: 8px;
  padding: 1px 4px;
  font-weight: 700;
  animation: ${pricePulse} 1.5s infinite;
`;
