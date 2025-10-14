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
            <FaTwitter />
            <Link href="https://x.com/solpicksdotfun?s=21">Twitter</Link>
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
