import { useState, useContext } from "react";
import { Link , useNavigate} from "react-router";
import api from '../api/axios.js'
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext.jsx";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();

async function handleLogin()
{
  if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    
    try
    {
        const login = await api.post('/auth/login',{
                email : email,
                password : password
            })
        toast.success("User login Successfully!");
        // console.log(login);

        // *** Redirect the user to thier specified Dashboards.
            const res = await api.get('/auth/me');   // fetch WHO we just logged in as
            setUser(res.data.User);                  // update context with the new user
        navigate(res.data.User.role === 'mentor'? '/Mentordashboard' : '/dashboard');
    }
    catch(err)
    {
        console.log(err);
        toast.error(err.response?.data?.message || "Login Failed! Please Try Again Later.");
    }
}


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

        <div className="text-sm text-zinc-400">
          Don't have an account?
          <Link to="/signup" className="ml-2 text-white font-medium hover:text-purple-400 transition">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/25 to-blue-600/25 rounded-[30px] blur-xl" />

            <div className="relative bg-[#111111]/95 backdrop-blur-xl border border-zinc-800 rounded-[28px] p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Sign in to continue tracking your applications.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value = {email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-zinc-300">
                      Password
                    </label>
                    {/* Optional: forgot password link, if you build that feature later */}
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>

                <button
                  type="submit"
                  // TODO: disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-base font-semibold shadow-lg shadow-purple-600/25 transition duration-200 hover:from-purple-500 hover:to-violet-500 hover:shadow-purple-500/35 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {/* TODO: {loading ? "Signing in..." : "Sign In →"} */}
                  Sign In →
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                <p className="text-sm text-zinc-400">
                  Don't have an account?
                  <Link to="/signup" className="ml-1 text-purple-400 hover:text-purple-300 transition font-medium">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-3">
            Your information is securely protected.
          </p>
        </div>
      </main>
    </div>
  );
}