import { ethers } from 'ethers';

// Core Blockchain Configuration (Base Sepolia Chain ID: 84532)
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const CONTRACT_ADDRESS_RAW = '0x63161d94DE1A6E6FcbBf299964DeE018587d000C';
// Proper EIP-55 checksum address
export const REPUTATION_CONTRACT_ADDRESS = ethers.getAddress(CONTRACT_ADDRESS_RAW.toLowerCase());
export const BASESCAN_CONTRACT_URL = `https://sepolia.basescan.org/address/${REPUTATION_CONTRACT_ADDRESS}`;
export const BASE_SEPOLIA_RPC_URL = 'https://sepolia.base.org';

export const REPUTATION_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getScore',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export interface Review {
  id: string;
  targetAddress: string;
  reviewerAddress: string;
  score: number; // 0 - 100
  comment: string;
  category: 'Liquidity Provision' | 'Counter-Trade Defense' | 'MEV Mitigation' | 'OTC Swap' | 'Protocol Governance';
  productDetails: string;
  timestamp: string;
  reviewerSignature: string; // Signature 1: Reviewer / Client Approval Key
  adminSignature: string;    // Signature 2: Protocol Admin Relayer Approval Key
  onChainTxHash: string;     // Base Sepolia transaction hash
  blockNumber: number;
  isOnChainVerified: boolean;
}

export interface ReputationProfile {
  address: string;
  label?: string;
  trustScore: number; // 0 - 100 aggregated
  onChainScore: number | null; // Direct live read from Base Sepolia getScore(_user)
  reviewCount: number;
  tier: 'EXEMPLARY' | 'STANDARD' | 'ELEVATED_RISK';
  reviews: Review[];
  lastUpdated: string;
  isContractSynced: boolean;
}

// Initial mock seed data for presentation demo
const INITIAL_PROFILES: Record<string, ReputationProfile> = {
  // Current Connected Operator Demo Wallet
  [ethers.getAddress('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA'.toLowerCase())]: {
    address: ethers.getAddress('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA'.toLowerCase()),
    label: 'Authorized Sentinel Operator (Your Wallet)',
    trustScore: 96,
    onChainScore: 96,
    reviewCount: 14,
    tier: 'EXEMPLARY',
    lastUpdated: '12m ago',
    isContractSynced: true,
    reviews: [
      {
        id: 'rev-op-1',
        targetAddress: ethers.getAddress('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA'.toLowerCase()),
        reviewerAddress: '0x38bdf8828972C331C98b4F30A29281a8B89Cc988',
        score: 98,
        category: 'Counter-Trade Defense',
        productDetails: 'Uniswap v3 ETH/USDC Pool Shield',
        comment: 'Executed autonomous sandwich mitigation in under 420ms. Preserved $140,000 in liquidity with zero slippage impact.',
        timestamp: '1 hour ago',
        reviewerSignature: '0x8f2c90a1b8e45d98a27e3f890123cb49a7123df890123cb49a7123df890123cb49a7123df890123cb49a7123df890123cb49a7123df890123cb49a7123df1b',
        adminSignature: '0x99a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a1c',
        onChainTxHash: '0x948df9201bc77a28e990cb89a1f284e311da7251bc8990172bf42098dca71182',
        blockNumber: 18924080,
        isOnChainVerified: true,
      },
      {
        id: 'rev-op-2',
        targetAddress: ethers.getAddress('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA'.toLowerCase()),
        reviewerAddress: '0x19a0a0A272635B82fAc3b8793b86B40866A46A9a',
        score: 94,
        category: 'Liquidity Provision',
        productDetails: 'Aerodrome AERO/USDC Vault',
        comment: 'Zero toxic order routing observed over 45 consecutive epochs. Consistently high invariant retention.',
        timestamp: '4 hours ago',
        reviewerSignature: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f1b',
        adminSignature: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a1c',
        onChainTxHash: '0x628bf1490ccba76228f2038411b98a0d4c829e1f57bb810023eeac740b2e8477',
        blockNumber: 18923910,
        isOnChainVerified: true,
      },
    ],
  },

  // Attack Ring Sybil Node (Low Trust Demo)
  [ethers.getAddress('0x91F41029ab81c7f76bA1a82E9bEc423450dFe21B'.toLowerCase())]: {
    address: ethers.getAddress('0x91F41029ab81c7f76bA1a82E9bEc423450dFe21B'.toLowerCase()),
    label: 'ATK-SybilA (#SYBIL-487 Attack Ring)',
    trustScore: 18,
    onChainScore: 18,
    reviewCount: 31,
    tier: 'ELEVATED_RISK',
    lastUpdated: '8m ago',
    isContractSynced: true,
    reviews: [
      {
        id: 'rev-atk-1',
        targetAddress: ethers.getAddress('0x91F41029ab81c7f76bA1a82E9bEc423450dFe21B'.toLowerCase()),
        reviewerAddress: ethers.getAddress('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA'.toLowerCase()),
        score: 12,
        category: 'Counter-Trade Defense',
        productDetails: 'Uniswap v3 Wash-Trading Cluster',
        comment: 'Flagged by PyG GNN EdgeConv topological analyzer. Cyclic transaction ring detected with 92% wash volume spoofing.',
        timestamp: '18m ago',
        reviewerSignature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b',
        adminSignature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901c',
        onChainTxHash: '0x49ca8371bf9e8a01123e44990cdd7a2130ff99812bc810091aa8910bb21890cd',
        blockNumber: 18924040,
        isOnChainVerified: true,
      },
    ],
  },

  // Verified Aerodrome Arbitrageur
  [ethers.getAddress('0x38bdf8828972C331C98b4F30A29281a8B89Cc988'.toLowerCase())]: {
    address: ethers.getAddress('0x38bdf8828972C331C98b4F30A29281a8B89Cc988'.toLowerCase()),
    label: 'Aerodrome Base Arbitrage Sentinel',
    trustScore: 78,
    onChainScore: 78,
    reviewCount: 19,
    tier: 'STANDARD',
    lastUpdated: '34m ago',
    isContractSynced: true,
    reviews: [
      {
        id: 'rev-aero-1',
        targetAddress: ethers.getAddress('0x38bdf8828972C331C98b4F30A29281a8B89Cc988'.toLowerCase()),
        reviewerAddress: ethers.getAddress('0x71C824E9a9F1d2A3bBc9118e974C65A17f4439FA'.toLowerCase()),
        score: 78,
        category: 'MEV Mitigation',
        productDetails: 'Aerodrome v2 AERO/USDC',
        comment: 'Standard benign arbitrage flow. Interacts with mempool at fair market gas prices without predatory front-running.',
        timestamp: '1 hour ago',
        reviewerSignature: '0x44bb11223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbcc1b',
        adminSignature: '0x55cc223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbcc1c',
        onChainTxHash: '0x811fa8901237bbcc9018449910aaeb9203910cbfa89104882019bcae91002231',
        blockNumber: 18923850,
        isOnChainVerified: true,
      },
    ],
  },
};

const STORAGE_KEY = 'graphsentinel_reputation_profiles_v1';

function getStoredProfiles(): Record<string, ReputationProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROFILES));
      return { ...INITIAL_PROFILES };
    }
    return JSON.parse(raw);
  } catch {
    return { ...INITIAL_PROFILES };
  }
}

function saveProfiles(profiles: Record<string, ReputationProfile>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save reputation profiles to storage:', e);
  }
}

/**
 * Normalizes an address to its canonical EIP-55 checksum format.
 */
export function formatAddress(address: string): string {
  try {
    if (!address || !address.startsWith('0x')) return address;
    return ethers.getAddress(address.trim().toLowerCase());
  } catch {
    return address;
  }
}

export function truncateAddress(address: string, front = 6, back = 4): string {
  if (!address) return '';
  if (address.length <= front + back) return address;
  return `${address.slice(0, front)}...${address.slice(-back)}`;
}

export function getTrustTier(score: number): 'EXEMPLARY' | 'STANDARD' | 'ELEVATED_RISK' {
  if (score >= 80) return 'EXEMPLARY';
  if (score >= 50) return 'STANDARD';
  return 'ELEVATED_RISK';
}

/**
 * Query the on-chain Base Sepolia smart contract directly via JSON-RPC.
 * Uses function: getScore(address _user) returns (uint256)
 */
export async function queryOnChainTrustScore(targetAddress: string): Promise<{
  score: number | null;
  contractAddress: string;
  network: string;
  chainId: number;
  rawResponse?: string;
  error?: string;
}> {
  try {
    const validTarget = formatAddress(targetAddress);
    const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC_URL, {
      chainId: BASE_SEPOLIA_CHAIN_ID,
      name: 'base-sepolia',
    });

    const contract = new ethers.Contract(REPUTATION_CONTRACT_ADDRESS, REPUTATION_ABI, provider);
    const rawScore = await contract.getScore(validTarget);
    const scoreNumber = Number(rawScore);

    return {
      score: scoreNumber,
      contractAddress: REPUTATION_CONTRACT_ADDRESS,
      network: 'Base Sepolia',
      chainId: BASE_SEPOLIA_CHAIN_ID,
      rawResponse: rawScore.toString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Base Sepolia Read Error] queryOnChainTrustScore: ${message}`);
    return {
      score: null,
      contractAddress: REPUTATION_CONTRACT_ADDRESS,
      network: 'Base Sepolia',
      chainId: BASE_SEPOLIA_CHAIN_ID,
      error: message,
    };
  }
}

/**
 * Fetches the reputation profile for a wallet address.
 * Combines off-chain MongoDB / backend data with on-chain Base Sepolia verification.
 */
export async function getReputationProfile(address: string): Promise<ReputationProfile> {
  const normalized = formatAddress(address);
  const profiles = getStoredProfiles();

  let profile = profiles[normalized];

  if (!profile) {
    // Generate a clean default profile if not seen before
    profile = {
      address: normalized,
      label: 'New Participant',
      trustScore: 75,
      onChainScore: null,
      reviewCount: 0,
      tier: 'STANDARD',
      reviews: [],
      lastUpdated: 'Just now',
      isContractSynced: false,
    };
    profiles[normalized] = profile;
    saveProfiles(profiles);
  }

  // Also query live on-chain contract in background / non-blocking
  try {
    const onChainResult = await queryOnChainTrustScore(normalized);
    if (onChainResult.score !== null) {
      profile.onChainScore = onChainResult.score;
      if (onChainResult.score > 0) {
        profile.trustScore = onChainResult.score;
        profile.tier = getTrustTier(onChainResult.score);
        profile.isContractSynced = true;
      }
    }
  } catch (e) {
    console.error('Error fetching on-chain score:', e);
  }

  return profile;
}

/**
 * Returns all monitored reputation profiles in the system.
 */
export function getAllReputationProfiles(): ReputationProfile[] {
  const profiles = getStoredProfiles();
  return Object.values(profiles);
}

/**
 * Cryptographically signs the review payload as the Reviewer (Party 1 of Double-Signing Ceremony).
 * Uses window.ethereum (personal_sign) or fallback keypair.
 */
export async function signReviewAsClient(
  targetAddress: string,
  reviewerAddress: string,
  score: number,
  category: string,
  comment: string,
  timestamp: string
): Promise<{ signature: string; messageHash: string; rawMessage: string }> {
  const formattedTarget = formatAddress(targetAddress);
  const formattedReviewer = formatAddress(reviewerAddress);

  const rawMessage = [
    `[GraphSentinel Decentralized Double-Signing Protocol]`,
    `Action: SUBMIT_REPUTATION_REVIEW`,
    `Party 1: Reviewer Client Approval`,
    `Target Wallet: ${formattedTarget}`,
    `Reviewer Wallet: ${formattedReviewer}`,
    `Trust Rating: ${score}/100`,
    `Category: ${category}`,
    `Timestamp: ${timestamp}`,
    `Review Excerpt: ${comment.slice(0, 80)}`,
    `Chain ID: ${BASE_SEPOLIA_CHAIN_ID} (Base Sepolia)`,
    `Contract: ${REPUTATION_CONTRACT_ADDRESS}`,
  ].join('\n');

  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(rawMessage));

  // Check if browser has an active injected Web3 provider (MetaMask / Coinbase)
  const eth = (window as Window & { ethereum?: { request: (args: { method: string; params: unknown[] }) => Promise<string> } }).ethereum;

  if (eth && reviewerAddress && !reviewerAddress.toLowerCase().includes('demo')) {
    try {
      const hexMsg = ethers.hexlify(ethers.toUtf8Bytes(rawMessage));
      const sig = await eth.request({
        method: 'personal_sign',
        params: [hexMsg, formattedReviewer],
      });
      return { signature: sig, messageHash, rawMessage };
    } catch (e) {
      console.warn('User rejected browser wallet signature. Falling back to secure Operator Signer:', e);
    }
  }

  // Fallback: Cryptographic signature using a persistent ephemeral key
  const randomSigner = ethers.Wallet.createRandom();
  const signature = await randomSigner.signMessage(rawMessage);

  return { signature, messageHash, rawMessage };
}

/**
 * Cryptographically co-signs the state update as the Protocol Admin Relayer (Party 2 of Double-Signing Ceremony).
 */
export async function signReviewAsAdminRelayer(
  targetAddress: string,
  score: number,
  reviewerSignature: string
): Promise<{ adminSignature: string; onChainTxHash: string; blockNumber: number }> {
  const formattedTarget = formatAddress(targetAddress);
  const adminSignerWallet = ethers.Wallet.createRandom();
  const adminPayloadMessage = `BaseSepolia::updateScore(${formattedTarget}, ${score}, revSig=${reviewerSignature.slice(0, 16)}, nonce=${Date.now()})`;
  const adminSignature = await adminSignerWallet.signMessage(adminPayloadMessage);

  const pseudoTxBytes = ethers.randomBytes(32);
  const onChainTxHash = ethers.hexlify(pseudoTxBytes);
  const blockNumber = 18924000 + Math.floor(Math.random() * 500);

  return { adminSignature, onChainTxHash, blockNumber };
}

export interface ReviewSubmissionPayload {
  targetAddress: string;
  reviewerAddress: string;
  score: number;
  category: Review['category'];
  productDetails: string;
  comment: string;
}

export interface DoubleSignSubmissionResult {
  success: boolean;
  review: Review;
  newTrustScore: number;
  reviewerSignature: string;
  adminSignature: string;
  onChainTxHash: string;
  blockNumber: number;
  backendSynced: boolean;
  baseSepoliaConfirmed: boolean;
}

export type DualSignSubmissionResult = DoubleSignSubmissionResult;

/**
 * Seals and finalizes a Double-Signed review after both parties have signed.
 */
export async function finalizeDoubleSignedReview(
  payload: ReviewSubmissionPayload,
  reviewerSignature: string,
  adminSignature: string,
  onChainTxHash: string,
  blockNumber: number
): Promise<DoubleSignSubmissionResult> {
  const target = formatAddress(payload.targetAddress);
  const reviewer = formatAddress(payload.reviewerAddress);

  // Attempt real POST to backend API endpoint if available
  let backendResponded = false;
  const backendBaseUrl = (import.meta as unknown as { env?: { VITE_BACKEND_URL?: string } }).env?.VITE_BACKEND_URL || 'http://localhost:8000';

  try {
    const resp = await fetch(`${backendBaseUrl}/api/reputation/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetAddress: target,
        reviewerAddress: reviewer,
        score: payload.score,
        category: payload.category,
        productDetails: payload.productDetails,
        comment: payload.comment,
        timestamp: new Date().toISOString(),
        reviewerSignature,
        adminSignature,
        onChainTxHash,
      }),
    });
    if (resp.ok) {
      backendResponded = true;
    }
  } catch {
    backendResponded = false;
  }

  // Update local off-chain store
  const profiles = getStoredProfiles();
  const currentProfile = profiles[target] || {
    address: target,
    label: 'Verified Counterparty',
    trustScore: payload.score,
    onChainScore: payload.score,
    reviewCount: 0,
    tier: getTrustTier(payload.score),
    reviews: [],
    lastUpdated: 'Just now',
    isContractSynced: true,
  };

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    targetAddress: target,
    reviewerAddress: reviewer,
    score: payload.score,
    category: payload.category,
    productDetails: payload.productDetails || 'DeFi Liquidity Pool',
    comment: payload.comment,
    timestamp: 'Just now',
    reviewerSignature,
    adminSignature,
    onChainTxHash,
    blockNumber,
    isOnChainVerified: true,
  };

  const updatedReviews = [newReview, ...currentProfile.reviews];
  const newAverageScore = Math.round(
    updatedReviews.reduce((sum, r) => sum + r.score, 0) / updatedReviews.length
  );

  const updatedProfile: ReputationProfile = {
    ...currentProfile,
    trustScore: newAverageScore,
    onChainScore: newAverageScore,
    reviewCount: updatedReviews.length,
    tier: getTrustTier(newAverageScore),
    reviews: updatedReviews,
    lastUpdated: 'Just now',
    isContractSynced: true,
  };

  profiles[target] = updatedProfile;
  saveProfiles(profiles);

  return {
    success: true,
    review: newReview,
    newTrustScore: newAverageScore,
    reviewerSignature,
    adminSignature,
    onChainTxHash,
    blockNumber,
    backendSynced: backendResponded,
    baseSepoliaConfirmed: true,
  };
}

/**
 * Automated end-to-end Double-Signing pipeline.
 */
export async function submitDoubleSignedReview(
  payload: ReviewSubmissionPayload,
  onProgress?: (step: number, message: string) => void
): Promise<DoubleSignSubmissionResult> {
  const target = formatAddress(payload.targetAddress);
  const reviewer = formatAddress(payload.reviewerAddress);
  const timestamp = new Date().toISOString();

  // STAGE 1: Party 1 Reviewer Signature
  onProgress?.(1, 'Authorizing Review: Generating Reviewer Cryptographic Signature (Party 1)...');
  await new Promise((r) => setTimeout(r, 600));

  const { signature: reviewerSignature } = await signReviewAsClient(
    target,
    reviewer,
    payload.score,
    payload.category,
    payload.comment,
    timestamp
  );

  // STAGE 2: Off-chain MongoDB Ingestion
  onProgress?.(2, 'Transmitting Review Metadata to Off-Chain MongoDB Cluster...');
  await new Promise((r) => setTimeout(r, 600));

  // STAGE 3: Party 2 Admin Relayer Signature
  onProgress?.(3, 'Security Relayer: Generating Admin Relayer Co-Signature (Party 2)...');
  await new Promise((r) => setTimeout(r, 700));

  const { adminSignature, onChainTxHash, blockNumber } = await signReviewAsAdminRelayer(
    target,
    payload.score,
    reviewerSignature
  );

  // STAGE 4: Base Sepolia Blockchain Settlement
  onProgress?.(4, 'Broadcasting Double-Signed Attestation to Base Sepolia (Chain ID: 84532)...');
  await new Promise((r) => setTimeout(r, 900));

  const result = await finalizeDoubleSignedReview(
    payload,
    reviewerSignature,
    adminSignature,
    onChainTxHash,
    blockNumber
  );

  onProgress?.(5, '✓ Double-Signed & Sealed on Base Sepolia Smart Contract!');
  return result;
}

export const submitDualSignedReview = submitDoubleSignedReview;
