'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Delete, ArrowRight } from 'lucide-react';

export default function CashierLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  const PIN_LENGTH = 4;

  const handleNumClick = (num) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + num);
      if (error) setError('');
    }
  };

  const handleClear = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUsernameInput(false);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length === PIN_LENGTH) {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:3000/api/auth/login/pin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, pin }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          _id: data._id,
          name: data.name,
          username: data.username,
          role: data.role
        }));

        router.push('/dashboard/cashier');
      } catch (err) {
        setError(err.message || 'An error occurred during login');
        setPin('');
      } finally {
        setLoading(false);
      }
    }
  };

  const numPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#f8e8d0] font-sans p-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[#e0d6cc]">
        
        <div className="bg-[#5c4738] p-6 text-[#f8e8d0] flex flex-col items-center text-center">
          <Coffee size={48} strokeWidth={1.5} className="mb-2" />
          <h1 className="text-2xl font-bold tracking-wide">Cafe POS</h1>
          <p className="text-sm opacity-90">Cashier Login</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {showUsernameInput ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="text-[#5c4738] font-medium block mb-2">
                  Enter your username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-[#f8e8d0] border border-[#d4c5b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c4738] text-[#5c4738]"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#5c4738] hover:bg-[#4a3728] text-white font-bold rounded-lg transition-colors"
              >
                Continue
              </button>
            </form>
          ) : (
            <>
              <div className="mb-8 flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h2 className="text-[#5c4738] font-medium">Enter your 4-digit PIN</h2>
                  <p className="text-sm text-gray-600 mt-1">{username}</p>
                  <button
                    onClick={() => {
                      setShowUsernameInput(true);
                      setPin('');
                      setError('');
                    }}
                    className="text-xs text-[#5c4738] underline mt-1"
                  >
                    Change user
                  </button>
                </div>
                <div className="flex gap-4">
                  {[...Array(PIN_LENGTH)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        i < pin.length
                          ? 'bg-[#5c4738] border-[#5c4738]'
                          : 'border-[#d4c5b5] bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {numPad.map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumClick(num)}
                    disabled={loading}
                    className="h-16 w-full bg-[#f8e8d0] text-[#5c4738] text-2xl font-semibold rounded-xl hover:bg-[#eddbc7] active:bg-[#d4c5b5] transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
                    type="button"
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="h-16 w-full bg-red-50 text-red-800 rounded-xl hover:bg-red-100 active:bg-red-200 transition-colors flex items-center justify-center disabled:opacity-50"
                  type="button"
                  aria-label="Clear"
                >
                  <Delete size={24} />
                </button>

                <button
                  onClick={() => handleNumClick('0')}
                  disabled={loading}
                  className="h-16 w-full bg-[#f8e8d0] text-[#5c4738] text-2xl font-semibold rounded-xl hover:bg-[#eddbc7] active:bg-[#d4c5b5] transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
                  type="button"
                >
                  0
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={pin.length !== PIN_LENGTH || loading}
                  className={`h-16 w-full rounded-xl flex items-center justify-center transition-all text-white shadow-md
                    ${pin.length === PIN_LENGTH && !loading
                      ? 'bg-[#5c4738] hover:bg-[#4a3728] active:scale-95' 
                      : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  type="submit"
                  aria-label="Submit PIN"
                >
                  {loading ? '...' : <ArrowRight size={28} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}