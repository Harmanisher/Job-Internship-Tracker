import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import Sidebar from "../components/Sidebar.jsx";
import AuthContext from "../../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

import {
  Menu,
  Users,
  Search,
  ChevronRight,
  Mail,
  UserRound,
  UserCheck,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function MentorDashboard() {
  const { user } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch students assigned to this mentor
  async function fetchStudents() {
    try {
      const response = await api.get("/mentor/students");

      setStudents(response.data.students || []);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Couldn't load your students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search students
  const filteredStudents = students.filter((student) => {
    const name = student.name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    return name.includes(searchText) || email.includes(searchText);
  });

  return (
    <div className="min-h-screen bg-[#05030f] text-white relative overflow-hidden">
      {/* ================= BACKGROUND GLOWS ================= */}

      <div className="fixed -top-40 -right-40 w-[550px] h-[550px] bg-purple-700/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="fixed -bottom-40 -left-40 w-[550px] h-[550px] bg-blue-700/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="fixed top-[35%] left-[40%] w-[400px] h-[400px] bg-indigo-700/10 blur-[170px] rounded-full pointer-events-none" />

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        active="/mentor-dashboard"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ================= MAIN ================= */}

      <main className="md:ml-64 min-h-screen relative z-10">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* ================= MOBILE MENU ================= */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-6 w-11 h-11 rounded-xl bg-[#11101a] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purple-500/40 transition"
          >
            <Menu size={20} />
          </button>

          {/* ================= HEADER ================= */}

          <section className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-purple-400" />
                  </div>

                  <span className="text-sm text-purple-400 font-medium">
                    Mentor Dashboard
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {user?.name || "Mentor"}
                  </span>
                </h1>

                <p className="text-zinc-500 mt-2 max-w-2xl">
                  Monitor your assigned students and keep track of their
                  placement progress.
                </p>
              </div>

              {/* Mentor profile */}

              <div className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "M"}
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {user?.name || "Mentor"}
                  </p>

                  <p className="text-xs text-zinc-500">Mentor</p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= STAT CARDS ================= */}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {/* Assigned Students */}

            <div className="group relative overflow-hidden rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5 hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Assigned Students</p>

                  <h2 className="text-3xl font-bold mt-3">{students.length}</h2>

                  <p className="text-xs text-zinc-600 mt-2">
                    Students under your mentorship
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
                  <Users size={21} />
                </div>
              </div>
            </div>

            {/* Showing */}

            <div className="group relative overflow-hidden rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5 hover:border-blue-500/30 transition-all duration-300">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Showing</p>

                  <h2 className="text-3xl font-bold mt-3">
                    {filteredStudents.length}
                  </h2>

                  <p className="text-xs text-zinc-600 mt-2">
                    Students matching search
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
                  <UserCheck size={21} />
                </div>
              </div>
            </div>

            {/* Access Level */}

            <div className="group relative overflow-hidden rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5 hover:border-indigo-500/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-600/10 blur-3xl rounded-full" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Access Level</p>

                  <h2 className="text-xl font-bold mt-4">Mentor</h2>

                  <p className="text-xs text-zinc-600 mt-2">
                    Student monitoring access
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                  <GraduationCap size={21} />
                </div>
              </div>
            </div>
          </section>

          {/* ================= STUDENTS SECTION ================= */}

          <section>
            {/* Section header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-semibold">Your Students</h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Select a student to view their applications.
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full md:w-[320px]">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#11101a]/90 backdrop-blur-xl border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 hover:border-zinc-700"
                />
              </div>
            </div>

            {/* ================= LOADING ================= */}

            {loading && (
              <div className="min-h-[300px] flex flex-col items-center justify-center rounded-2xl bg-[#11101a]/70 border border-zinc-800">
                <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-purple-500 animate-spin" />

                <p className="text-sm text-zinc-500 mt-4">
                  Loading students...
                </p>
              </div>
            )}

            {/* ================= EMPTY ================= */}

            {!loading && filteredStudents.length === 0 && (
              <div className="min-h-[300px] flex flex-col items-center justify-center text-center rounded-2xl bg-[#11101a]/70 backdrop-blur-xl border border-zinc-800 px-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-zinc-800 flex items-center justify-center mb-4">
                  <Users size={23} className="text-zinc-500" />
                </div>

                <h3 className="text-base font-medium">No students found</h3>

                <p className="text-sm text-zinc-500 mt-2 max-w-sm">
                  {search
                    ? "No students match your search."
                    : "You don't have any students assigned yet."}
                </p>
              </div>
            )}

            {/* ================= STUDENT CARDS ================= */}

            {!loading && filteredStudents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredStudents.map((student) => (
                  <Link
                    key={student._id}
                    to={`/MentorStudents/${student._id}`}
                    className="group relative overflow-hidden rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Card glow */}

                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative">
                      {/* Student header */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}

                          <div className="w-12 h-12 rounded-xl shrink-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 font-semibold text-lg">
                            {student.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition">
                              {student.name}
                            </h3>

                            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                              <Mail size={12} />

                              <span className="truncate">{student.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}

                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white/[0.03] border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-purple-400 group-hover:border-purple-500/20 transition">
                          <ArrowUpRight size={15} />
                        </div>
                      </div>

                      {/* Divider */}

                      <div className="h-px bg-zinc-800/80 my-5" />

                      {/* Bottom section */}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
                            <UserRound size={14} className="text-blue-400" />
                          </div>

                          <div>
                            <p className="text-xs text-zinc-600">Role</p>

                            <p className="text-sm text-zinc-300">Student</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-purple-400 opacity-70 group-hover:opacity-100 transition">
                          View Applications
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
