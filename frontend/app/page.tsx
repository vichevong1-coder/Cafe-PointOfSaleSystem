import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f8e8d0] font-sans p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <Coffee size={80} strokeWidth={1.5} className="text-[#5c4738]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#5c4738]">Café POS</h1>
          <p className="text-lg text-gray-600">Point of Sale System</p>
        </div>

        <div className="space-y-4 pt-4">
          <Link 
            href="/login/admin"
            className="block w-full py-4 px-6 bg-[#5c4738] hover:bg-[#4a3728] text-white font-bold rounded-xl transition-colors shadow-md text-center"
          >
            Admin Login
          </Link>
          
          <Link 
            href="/login/cashier"
            className="block w-full py-4 px-6 bg-white hover:bg-[#eddbc7] text-[#5c4738] font-bold rounded-xl transition-colors shadow-md border-2 border-[#5c4738] text-center"
          >
            Cashier Login
          </Link>
        </div>
      </div>
    </div>
  );
}