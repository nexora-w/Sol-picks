export default function Footer() {
  return (
    <footer className="bg-[#141821] border-t border-[#2a3142] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-4">
              SolPick
            </h3>
            <p className="text-gray-400 text-sm">
              Decentralized sports betting on Solana blockchain
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Sports</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Basketball</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Football</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Soccer</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Baseball</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">How to Bet</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Odds Guide</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Responsible Gaming</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Discord</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">GitHub</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Documentation</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#2a3142] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 SolPick. Built on Solana.
          </p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">Devnet Live</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            ⚠️ Demo project for educational purposes only. Please gamble responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}

