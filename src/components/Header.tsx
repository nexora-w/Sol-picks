"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


const CA = "EVWvQM75h3kPwcAMbvjrP22qj9ENCqgDRnbmEe5Kpump";

interface HeaderProps {
  betType?: "matches" | "props";
  onBetTypeChange?: (type: "matches" | "props") => void;
}

export default function Header({ betType, onBetTypeChange }: HeaderProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    connection.getBalance(publicKey).then((balance) => {
      setBalance(balance / LAMPORTS_PER_SOL);
    });
  }, [publicKey, connection]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const formatContractAddress = (address: string | undefined, isMobile: boolean = false) => {
    if (!address || address === "Comming soon") {
      return address || "Comming soon";
    }
    
    if (isMobile && address.length > 8) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    
    return address;
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="text-center border-b border-[#2a3142] py-2 bg-[#9810fa] text-white">
        <div className="flex items-center justify-center gap-2">
          <span>
            <span className="hidden sm:inline">Contract Address: </span>
            <span className="sm:hidden">CA: </span>
            <span className="hidden sm:inline">{CA}</span>
            <span className="sm:hidden">{formatContractAddress(
              CA,
              true
            )}</span>
          </span>
          <button
            onClick={() => {
              const contractAddress =
                CA ||
                "Comming soon";
              copyToClipboard(contractAddress);
            }}
            className={`p-1 hover:bg-white/20 rounded transition-colors cursor-pointer relative ${
              copySuccess ? 'bg-green-500/20' : ''
            }`}
            aria-label="Copy contract address"
          >
            {copySuccess ? (
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <header className="bg-[#141821] border-b border-[#2a3142]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="relative">
                <Image
                  src="/logo/logo.png"
                  alt="SolPicks"
                  width={300}
                  height={80}
                  className=""
                  priority
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            {betType && onBetTypeChange && (
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => onBetTypeChange("props")}
                  className={`font-medium transition-colors cursor-pointer text-sm lg:text-base ${
                    betType === "props"
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Player Props 🔥
                </button>
                <button
                  onClick={() => onBetTypeChange("matches")}
                  className={`font-medium transition-colors cursor-pointer text-sm lg:text-base ${
                    betType === "matches"
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Match Bets
                </button>
              </div>
            )}

            {/* Right Section - Social, Contract, Wallet & Balance */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Twitter Link */}
              <Link
                href="https://x.com/solpicksdotfun?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center p-2 rounded-lg hover:bg-[#1a1f2e] transition-colors"
                aria-label="Follow us on Twitter"
              >
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>

              {/* Balance - Hidden on very small screens */}
              {publicKey && balance !== null && (
                <div className="hidden sm:block bg-[#1a1f2e] px-3 py-2 rounded-lg border border-[#2a3142]">
                  <div className="text-xs text-gray-400">Balance</div>
                  <div className="text-white font-bold text-sm">
                    {balance.toFixed(2)} SOL
                  </div>
                </div>
              )}

              {/* Wallet Button */}
              <div className="wallet-button-container">
                <WalletMultiButton />
              </div>

              {/* Mobile Menu Button */}
              {betType && onBetTypeChange && (
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-[#1a1f2e] transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {betType && onBetTypeChange && isMobileMenuOpen && (
            <div className="md:hidden border-t border-[#2a3142] bg-[#141821]">
              <div className="px-4 py-4 space-y-3">
                {/* Mobile Social Links */}
                <div className="flex items-center gap-4 mb-4">
                  <a
                    href="https://twitter.com/solpicks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1f2e] transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-sm text-gray-300">Follow us</span>
                  </a>
                </div>

                {/* Mobile Contract Address */}
                <div className="bg-[#1a1f2e] px-4 py-3 rounded-lg border border-[#2a3142] mb-4">
                  <div className="text-xs text-gray-400 mb-2">
                    CA
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-blue-400 font-mono flex-1 break-all">
                      {formatContractAddress(
                        CA,
                        true
                      ) || "0x..."}
                    </code>
                    <button
                      onClick={() => {
                        const contractAddress =
                          CA;
                        if (contractAddress) {
                          copyToClipboard(contractAddress);
                        }
                      }}
                      className={`p-1 hover:bg-[#2a3142] rounded transition-colors cursor-pointer ${
                        copySuccess ? 'bg-green-500/20' : ''
                      }`}
                      aria-label="Copy contract address"
                    >
                      {copySuccess ? (
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Balance Display */}
                {publicKey && balance !== null && (
                  <div className="sm:hidden bg-[#1a1f2e] px-4 py-3 rounded-lg border border-[#2a3142] mb-4">
                    <div className="text-xs text-gray-400">Balance</div>
                    <div className="text-white font-bold">
                      {balance.toFixed(2)} SOL
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <button
                  onClick={() => {
                    onBetTypeChange("props");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    betType === "props"
                      ? "text-white bg-[#1a1f2e] border border-[#2a3142]"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1f2e]"
                  }`}
                >
                  Player Props 🔥
                </button>
                <button
                  onClick={() => {
                    onBetTypeChange("matches");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    betType === "matches"
                      ? "text-white bg-[#1a1f2e] border border-[#2a3142]"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1f2e]"
                  }`}
                >
                  Match Bets
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
