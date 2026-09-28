import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Signup(){

  const Navigate = useNavigate();

  const [mentors, fetchMentors] = useState([]);
  const [Mentor, setMentor] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState({});

//   ****** Fetching Mentors for the DropDown.
async function getMentors()
{
    try
    {
        const response = await api.get('/mentors');        
        fetchMentors(response.data.mentors);
    }
    catch(err)
    {
        console.error("Failed to Fetch Mentors!",err);
    }
}

useEffect(()=>{
    getMentors()
},[]);

// **** Validation of the Form fields.
function validate()
{
    const newErrors={};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    // ***Name
    if(name.trim().length<3)
    {
        newErrors.name = "Name must contain atleast 3 characters";
    }
    else if(!/^[A-Za-z ]+$/.test(name))
    {
        newErrors.name = "Name can contain only Alphabets"
    }

    // ***Email
    if(email==='')
    {
        newErrors.email = "Email is Required"
    }
    else if(!emailRegex.test(email))
    {
        newErrors.email = "Enter a valid email address"
    }

    // *** Password
    if(!passwordRegex.test(password))
    {
        newErrors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
    }

    // if(Mentor ==="select" || Mentor.length==0)
    // {
    //     newErrors.mentor = "Mentor must be required"
    // }

    setError(newErrors);

    return Object.keys(newErrors).length === 0 //If there are errors then it returns false otherwise true
}

// *** Save the Data. ie. Form Submission
async function handleSubmit()
{
    try
    {
            if(!validate())
            {
                return;    // If Errors are there then return otherwise make the post request and save the changes.
            }
        
            // *** If there are No Errors then hit the post request and save the data in the Database.
            const response = await api.post('/auth/signup',{
                name : name,
                email : email,
                password : password,
                mentorId : Mentor
            })
        
            if(response.status === 200)
            {
                toast.success("User Regsitered Successfully");

                // **** Redirect to the verification Page to verify the Registered User.
                Navigate(`/Verify?email=${encodeURIComponent(email)}`);

                setName('');
                setEmail('');
                setpassword('');
                setMentor('');
            }

    }
    catch(err)
    {
        console.error("Something Went Wrong", err);
        toast.error(err.response?.data?.message || "Something went Wrong! Please Try again later");
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
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-bold text-lg">J</span>
          </div>

          <span className="text-xl font-semibold tracking-tight">JobTrack</span>
        </div>

        {/* Login */}
        <div className="text-sm text-zinc-400">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-white font-medium hover:text-purple-400 transition"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-2 min-h-0 overflow-y-auto">
        <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          
          {/* LEFT SIDE (PROMINENT & LARGE) */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-sm mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              Your career, organized
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
              Take full control
              <br />
              of your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {" "}
                career.
              </span>
            </h1>

            <p className="mt-5 text-base text-zinc-400 max-w-lg leading-relaxed">
              Track your applications, manage internships, connect with mentors
              and stay ahead of your placement journey — all from one platform.
            </p>

            {/* Small stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 max-w-md">
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-zinc-500 mt-1">Organized</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-zinc-500 mt-1">Tracking</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-xs text-zinc-500 mt-1">Dashboard</p>
              </div>
            </div>
          </div>

          {/* SIGNUP CARD (PROMINENT & LARGE) */}
          <div className="w-full max-w-lg mx-auto">
            <div className="mb-4 lg:hidden">
              <h1 className="text-3xl font-bold">Create your account</h1>
              <p className="text-zinc-500 text-sm mt-1">
                Start managing your career journey.
              </p>
            </div>

            <div className="relative">
              {/* Purple glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/25 to-blue-600/25 rounded-[30px] blur-xl" />

              <div className="relative bg-[#111111]/95 backdrop-blur-xl border border-zinc-800 rounded-[28px] p-6 sm:p-8 shadow-2xl">
                {/* Card heading */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Join JobTrack and manage everything in one place.
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(event)=>{setName(event.target.value)}}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-2.5 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                    />
                  </div>

                    {/* Error */}
                    {error.name && (
                      <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                        {error.name}
                      </div>
                    )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event)=>{setEmail(event.target.value)}}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-2.5 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                    />
                  </div>
                    {/* Error */}
                    {error.email && (
                      <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                        {error.email}
                      </div>
                    )}

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(event)=>{setpassword(event.target.value)}}
                      placeholder="Create a strong password"
                      required
                      className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-2.5 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                    />
                  </div>
                  {/* Error */}
                    {error.password && (
                      <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                        {error.password}
                      </div>
                    )}

                  {/* Mentor */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Mentor
                      <span className="text-zinc-600 ml-1">(Optional)</span>
                    </label>

                    <select
                      name="mentorId"
                      value={Mentor}
                      onChange={(event)=>{setMentor(event.target.value)}}
                      className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-2.5 text-[15px] text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700 cursor-pointer"
                    >
                      <option value="" className="bg-[#181818]">
                        Select a mentor
                      </option>

                      {mentors.map((m) => (
                        <option
                          key={m._id}
                          value={m._id}
                          className="bg-[#181818]"
                        >
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* {error.mentor && (
                      <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                        {error.mentor}
                      </div>
                    )} */}

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-base font-semibold shadow-lg shadow-purple-600/25 transition duration-200 hover:from-purple-500 hover:to-violet-500 hover:shadow-purple-500/35 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    Create Account →
                  </button>
                </form>

                {/* Bottom */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                  <p className="text-sm text-zinc-400">
                    Already have an account?
                    <Link
                      to="/login"
                      className="ml-1 text-purple-400 hover:text-purple-300 transition font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Security text */}
            <p className="text-center text-xs text-zinc-500 mt-3">
              Your information is securely protected.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}