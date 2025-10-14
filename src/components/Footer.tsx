import Link from "next/link";
import Image from "next/image";
import { FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#141821] border-t border-[#2a3142] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/logo/logo.png"
              alt="SolPick"
              width={400}
              height={300}
              priority
            />
            <p className="text-gray-400 text-sm -mt-10">
              Decentralized sports betting on Solana blockchain
            </p>
          </div>
          <div className="flex items-center justify-center mt-4">
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
          </div>
        </div>

        <div className="border-t border-[#2a3142] mt-8 pt-8 flex flex-col sm:flex-row justify-center items-center">
          <p className="text-gray-400 text-sm">
            © 2025 SolPick. Built on Solana.
          </p>
        </div>
      </div>
    </footer>
  );
}
