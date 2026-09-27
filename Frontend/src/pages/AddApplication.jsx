import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from '../api/axios.js'

export default function AddApplication() {


    // Status options must match your Application model's enum exactly.
    const STATUS_OPTIONS = ["Applied", "OA", "Interview", "Offer", "Rejected"];

const [company, setCompany] = useState('');
const [role, setRole] = useState('');
const [status, setStatus] = useState('Applied'); // sensible default
const [dateApplied, setDateApplied] = useState(''); // default to today if you want
const [notes, setNotes] = useState('');
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  function validate() { 
    const newErrors={};

    if(company.trim().length === 0)
    {
        newErrors.company = "Company Name is Required"
    }

    if(role.trim().length === 0)
    {
        newErrors.role = "Roles is Required";
    }

    if(!dateApplied)
    {
        newErrors.dateApplied = "Date is Required";
    }
    else{
        const selectedDate = new Date(dateApplied);
        const today = new Date();

        selectedDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

        if(today<selectedDate)
        {
            newErrors.dateApplied = "Future Dates are Not Allowed";
        }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;   //returns false if there are Errors.
  }


    async function handleSubmit() {

          if (!validate())
          {
            return;
          }
          setLoading(true);

          try {
            
            await api.post('/applications', { company, role, status, dateApplied, notes });
            toast.success("New Application Created Successfully!");
            navigate('/dashboard');
          } 
          catch (err) {
            toast.error(err.response?.data?.message || "Couldn't add application. Try again.");
          } 
          finally {
            setLoading(false);
          }
        }

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden flex flex-col">
      {/* Background glow — same as Login/Signup */}
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

        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/25 to-blue-600/25 rounded-[30px] blur-xl" />

            <div className="relative bg-[#111111]/95 backdrop-blur-xl border border-zinc-800 rounded-[28px] p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Add application
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Track a new job or internship you've applied to.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e)=>{e.preventDefault(); handleSubmit()}}
              >
                {/* Company */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={company}
                    required
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />

                  {/* Error */}
                  {errors.company && (
                    <div className="mt-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                      {errors.company}
                    </div>
                  )} 
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={role}
                    required
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                
                  {/* Error */}
                  {errors.role && (
                    <div className="mt-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                      {errors.role}
                    </div>
                  )}
                </div>

                {/* Status + Date Applied — side by side on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Status
                    </label>
                    <select
                      name="status"
                      value={status}
                      required
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Date applied
                    </label>
                    <input
                      type="date"
                      name="dateApplied"
                      required
                      value={dateApplied}
                      onChange={(e) => setDateApplied(e.target.value)}
                      className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Error */}
                {errors.dateApplied && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                    {errors.dateApplied}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Notes <span className="text-zinc-600 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Referral contact, interview prep, follow-up dates..."
                    rows={4}
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/dashboard"
                    className="flex-1 text-center py-3 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-base font-semibold shadow-lg shadow-purple-600/25 transition duration-200 hover:from-purple-500 hover:to-violet-500 hover:shadow-purple-500/35 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? "Adding..." : "Add application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}