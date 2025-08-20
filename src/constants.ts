declare global {
  interface Window {
    HELIUS_UNAVAILABLE?: boolean;
  }
}

import { PublicKey } from "@solana/web3.js";
import {
  FAKE_TOKEN_MINT,
  PoolToken,
  TokenMeta,
  makeHeliusTokenFetcher,
} from "gamba-react-ui-v2";

// Get RPC from the .env file or default to the public RPC.
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT;

// Solana address that will receive fees when somebody plays on this platform
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  import.meta.env.VITE_PLATFORM_CREATOR
);

// Gamba explorer URL - Appears in RecentPlays
export const EXPLORER_URL = "https://explorer.gamba.so";

// Platform URL - Appears in ShareModal
export const PLATFORM_SHARABLE_URL = "play.onchainbets.fun";

// Creator fee (in %)
export const PLATFORM_CREATOR_FEE = 0.01; // 1% !!max 7%!!

export const MULTIPLAYER_FEE = 0.01; // 1%

// Jackpot fee (in %)
export const PLATFORM_JACKPOT_FEE = 0.001; // 0.1%,  not jackpot game specific, but platform wide

// Referral fee (in %)
export const PLATFORM_REFERRAL_FEE = 0.0025; // 0.25%

/** If the user should be able to revoke an invite after they've accepted an invite */
export const PLATFORM_ALLOW_REFERRER_REMOVAL = true;

// Just a helper function
const lp = (
  tokenMint: PublicKey | string,
  poolAuthority?: PublicKey | string
): PoolToken => ({
  token: new PublicKey(tokenMint),
  authority:
    poolAuthority !== undefined ? new PublicKey(poolAuthority) : undefined,
});

/**
 * List of pools supported by this platform
 * Make sure the token you want to list has a corresponding pool on https://explorer.gamba.so/pools
 * For private pools, add the creator of the Liquidity Pool as a second argument
 */
export const POOLS = [
  lp(FAKE_TOKEN_MINT),
  lp("So11111111111111111111111111111111111111112"),
  lp("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
];

// The default token to be selected
export const DEFAULT_POOL = POOLS[0];

/**
 * List of token metadata for the supported tokens
 * Alternatively, we can provide a fetcher method to automatically fetch metdata. See TOKEN_METADATA_FETCHER below.
 */

export const TOKEN_METADATA: (Partial<TokenMeta> & { mint: PublicKey })[] = [
  {
    mint: FAKE_TOKEN_MINT,
    name: "Fake",
    symbol: "FAKE",
    image: "/fakemoney.png",
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 0,
  },
  {
    mint: new PublicKey("85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ"),
    name: "W",
    symbol: "Wormhole",
    image: "https://wormhole.com/token.png",
    baseWager: 1e6,
    decimals: 6,
    usdPrice: 0,
  },
];

type TokenMetaWithMinted = Partial<TokenMeta> & {
  mint: PublicKey;
  minted?: boolean;
};
export const FETCH_TOKEN_METADATA: TokenMetaWithMinted[] = [
  {
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    name: "SOLANA",
    symbol: "SOL",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 192.55,
  },
  {
    mint: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
    name: "Bonk",
    symbol: "BONK",
    image:
      "https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    baseWager: 1e9,
    decimals: 9,
    usdPrice: 0.00002806,
  },
  {
    mint: new PublicKey("pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn"),
    name: "PUMP",
    symbol: "PUMP",
    image:
      "https://dd.dexscreener.com/ds-data/tokens/solana/pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn.png?size=lg&key=821e9b",
    baseWager: 1e9,
    decimals: 6,
    usdPrice: 0.00347,
  },
  {
    mint: new PublicKey("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"),
    name: "Jupiter",
    symbol: "JUP",
    image: "https://static.jup.ag/jup/icon.png",
    baseWager: 1e9,
    decimals: 6,
    usdPrice: 0.5121,
  },
];

/** HTML to display to user that they need to accept in order to continue */
export const TOS_HTML = `
  <p><b>1. Age Requirement:</b> Must be at least 18 years old.</p>
  <p><b>2. Legal Compliance:</b> Follow local laws responsibly.</p>
  <p><b>3. Risk Acknowledgement:</b> Games involve risk; no guaranteed winnings.</p>
  <p><b>4. No Warranty:</b> Games provided "as is"; operate randomly.</p>
  <p><b>5. Limitation of Liability:</b> We're not liable for damages.</p>
  <p><b>6. Licensing Disclaimer:</b> Not a licensed casino.</p>
  <p><b>7. Fair Play:</b> Games are conducted fairly and transparently.</p>
  <p><b>8. Data Privacy:</b> Your privacy is important to us.</p>
  <p><b>9. Responsible Gaming:</b> Play responsibly; seek help if needed.</p>
`;

/**
 * A method for automatically fetching Token Metadata.
 * Here we create a fetcher that uses Helius metadata API, if an API key exists as an environment variable.
 */

export async function updateTokenPrices() {
  // CoinGecko IDs for supported tokens
  const coingeckoMap: { [mint: string]: string } = {
    So11111111111111111111111111111111111111112: "solana",
    pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn: "pump-fun",
    EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "usd-coin",
    JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: "jupiter-exchange-solana",
    DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: "bonk",
  };

  // Build CoinGecko URL
  const ids = Object.values(coingeckoMap).join(",");
  const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  // Promise for CoinGecko fetch
  const coingeckoPromise = fetch(coingeckoUrl)
    .then((res) => res.json())
    .then((data) => {
      FETCH_TOKEN_METADATA.forEach((token) => {
        const mint = token.mint.toBase58();
        if (mint === FAKE_TOKEN_MINT.toBase58()) {
          token.usdPrice = undefined;
          return;
        }
        const cgId = coingeckoMap[mint];
        if (cgId && data[cgId] && typeof data[cgId].usd === "number") {
          token.usdPrice = data[cgId].usd;
        }
      });
      if (typeof window !== "undefined") window.HELIUS_UNAVAILABLE = false;
      console.log(
        "Updated TOKEN_METADATA with CoinGecko prices:",
        FETCH_TOKEN_METADATA
      );
      return "coingecko";
    });

  // Only use CoinGecko for token prices
  try {
    await coingeckoPromise;
  } catch (error) {
    if (typeof window !== "undefined") window.HELIUS_UNAVAILABLE = true;
    console.error("Failed to fetch token prices from CoinGecko:", error);
  }
}

export const TOKEN_METADATA_FETCHER = (() => {
  // Only use CoinGecko, do not use Helius
})();

export const ENABLE_LEADERBOARD = true;
export const ENABLE_TROLLBOX = false; // Requires setup in vercel (check tutorial in discord)

/** If true, the featured game is fully playable inline on the dashboard */
export const FEATURED_GAME_INLINE = false;
export const FEATURED_GAME_ID: string | undefined = "mines"; // ← put game id or leave undefined

export { FAKE_TOKEN_MINT };
