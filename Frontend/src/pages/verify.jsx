import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";
import api from '../api/axios.js';
import { useNavigate } from "react-router";

export default function Verify() {

    const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = useState(10);
    const [otp, setotp] = useState();
    const Navigate = useNavigate();

    // **** Accessing email as it is sent in the url during Navigate in the signup page.
    const email = searchParams.get("email");

    // ***** Otp Timer.
    useEffect(() => {
      if (countdown <= 0) return;

      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [countdown]);


    // ***** Resend Otp
    async function handleResend()
    {
        try
        {
            const response = await api.post('/auth/resend-otp',{email: email});
        
                setCountdown(10);
                toast.success("otp resent!");
        }
        catch(err)
        {
            console.log(err);
        }
    }

    // **** Final Submitting the otp
    async function handleVerify()
    {
        try
        {
            await api.post('/auth/verify',
            {
                email : email,
                otp : otp
            })   

            toast.success("User Verified Successfully!");
            Navigate('/login');
        }
        catch(err)
        {
            console.log(err);
            toast.error(err.response?.data?.message || "Verification failed. Please try again.");
        }
    }

  // TODO: your own state (otp, error, loading, email from URL query, etc.)
  // TODO: your own handleSubmit function
  // TODO: your own resend OTP handler

  return (
    <div className="h-screen w-screen bg-black text-white relative overflow-x-hidden flex flex-col">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-[20%] w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[150px]" />
        <div className="absolute top-[10%] right-[-200px] w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-200px] left-[-150px] w-[450px] h-[450px] bg-purple-900/20 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-bold text-lg">J</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">JobTrack</span>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/25 to-blue-600/25 rounded-[30px] blur-xl" />

            <div className="relative bg-[#111111]/95 backdrop-blur-xl border border-zinc-800 rounded-[28px] p-6 sm:p-8 shadow-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Verify your email</h2>
                <p className="text-sm text-zinc-400 mt-2">
                  {/* TODO: display the email pulled from the URL query string */}
                  We sent a 6-digit code to <span className="text-zinc-300">your email</span>
                </p>
              </div>

              {/* TODO: your error display block here */}

              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    onChange={(event)=>{setotp(event.target.value)}}
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-center tracking-[0.4em] text-lg text-white placeholder:tracking-normal placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-base font-semibold shadow-lg shadow-purple-600/25 transition duration-200 hover:from-purple-500 hover:to-violet-500 hover:shadow-purple-500/35 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Verify Account →
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                <p className="text-sm text-zinc-400">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={()=>{handleResend()}}
                    disabled = {countdown>0}
                    className="text-purple-400 hover:text-purple-300 transition font-medium"
                  >
                   {countdown >0 ? `Resend OTP in ${countdown}` : `Resend OTP`}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-3">
            Code expires in 5 minutes.
          </p>
        </div>
      </main>
    </div>
  );
}