// Polyfill Buffer for browser (fixes _bn errors)
import { Buffer } from "buffer";
window.Buffer = Buffer;

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  GambaPlatformProvider,
  TokenMeta,
  TokenMetaProvider,
} from "gamba-react-ui-v2";
import { GambaProvider, SendTransactionProvider } from "gamba-react-v2";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import {
  DEFAULT_POOL,
  PLATFORM_CREATOR_ADDRESS,
  PLATFORM_CREATOR_FEE,
  PLATFORM_JACKPOT_FEE,
  PLATFORM_REFERRAL_FEE,
  RPC_ENDPOINT,
  TOKEN_METADATA,
} from "./constants";

// Define a valid TokenMetaFetcher function here or import it if available
import { TokenMetaFetcher } from "gamba-react-ui-v2";

const TOKEN_METADATA_FETCHER: TokenMetaFetcher = async () => {
  // Convert TOKEN_METADATA (array) to a Record<string, TokenMeta> object
  return TOKEN_METADATA.reduce((acc: Record<string, TokenMeta>, token) => {
    acc[token.mint.toString()] = {
      ...token,
      name: token.name ?? "",
      symbol: token.symbol ?? "",
      decimals: token.decimals ?? 0, // Ensure decimals is always a number
      baseWager: token.baseWager ?? 0, // Ensure baseWager is always a number
    };
    return acc;
  }, {});
};
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

function Root() {
  const wallets = React.useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <BrowserRouter>
      <ConnectionProvider
        endpoint={RPC_ENDPOINT}
        config={{ commitment: "processed" }}
      >
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            <TokenMetaProvider
              tokens={TOKEN_METADATA}
              fetcher={TOKEN_METADATA_FETCHER}
            >
              <SendTransactionProvider priorityFee={400_201}>
                <GambaProvider>
                  <GambaPlatformProvider
                    creator={PLATFORM_CREATOR_ADDRESS}
                    defaultCreatorFee={PLATFORM_CREATOR_FEE}
                    defaultJackpotFee={PLATFORM_JACKPOT_FEE}
                    defaultPool={DEFAULT_POOL}
                    referral={{
                      fee: PLATFORM_REFERRAL_FEE,
                      prefix: "code",
                    }}
                  >
                    <App />
                  </GambaPlatformProvider>
                </GambaProvider>
              </SendTransactionProvider>
            </TokenMetaProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  );
}

root.render(<Root />);
