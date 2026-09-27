import { useState , useEffect} from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import api from '../api/axios.js';
import Sidebar from "../components/Sidebar.jsx";
import toast from "react-hot-toast";

import {
  BriefcaseBusiness,
  ArrowLeft,
  Eye,
  Mail,
  Search,
  TrendingUp,
  Clock3,
  CheckCircle2,
  ClipboardCheck,
  Menu,
  Bell,
  Plus,
  ChevronRight,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";


// Status → color, same convention as the rest of the app.
const STATUS_COLORS = {
  Applied: "#3b82f6",
  OA: "#a855f7",
  Interview: "#eab308",
  Offer: "#10b981",
  Rejected: "#ef4444",
};







export default function MentorStudentApplications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { StudentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState([]);
  


    async function fetchApplications()
    {
        try
        {
            const response = await api.get('/mentor/student/applications/'+StudentId);
            setStudent(response.data.student);
            setApplications(response.data.applications);
        }
        catch(err)
        {
            console.log(err);
            toast.error("Couldn't load this Student's Applications");
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchApplications();
    },[StudentId]);



  const filteredApplications = applications.filter((a) =>
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    );

  const interviewCount = applications.filter((a) => a.status === "Interview").length;
  const offerCount = applications.filter((a) => a.status === "Offer").length;



      const statusData = [
    {
      name: "Applied",
      count: applications.filter(
        (a) => a.status === "Applied"
      ).length,
      gradient: "from-blue-500 to-cyan-400",
      text: "text-blue-400",
    },

    {
      name: "OA",
      count: applications.filter(
        (a) => a.status === "OA"
      ).length,
      gradient: "from-purple-500 to-violet-400",
      text: "text-purple-400",
    },

    {
      name: "Interview",
      count: applications.filter(
        (a) => a.status === "Interview"
      ).length,
      gradient: "from-yellow-500 to-orange-400",
      text: "text-yellow-400",
    },

    {
      name: "Offer",
      count: applications.filter(
        (a) => a.status === "Offer"
      ).length,
      gradient: "from-emerald-500 to-green-400",
      text: "text-emerald-400",
    },

    {
      name: "Rejected",
      count: applications.filter(
        (a) => a.status === "Rejected"
      ).length,
      gradient: "from-red-500 to-rose-400",
      text: "text-red-400",
    },
  ];

  // -------------------------------------------------------
  // DONUT CHART COLORS
  // -------------------------------------------------------

  const Donut_COLORS = {
    Applied: "#3b82f6",
    OA: "#a855f7",
    Interview: "#eab308",
    Offer: "#10b981",
    Rejected: "#ef4444",
  };
  

  return (
    <div className="min-h-screen bg-[#05030f] text-white relative overflow-hidden">
      {/* Background glow — same palette as MentorDashboard */}
      <div className="fixed -top-40 -right-40 w-[550px] h-[550px] bg-purple-700/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[550px] h-[550px] bg-blue-700/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="fixed top-[35%] left-[40%] w-[400px] h-[400px] bg-indigo-700/10 blur-[170px] rounded-full pointer-events-none" />

      <Sidebar
        active="/mentor-dashboard"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="md:ml-64 min-h-screen relative z-10">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-6 w-11 h-11 rounded-xl bg-[#11101a] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purple-500/40 transition"
          >
            <Menu size={20} />
          </button>

          {/* Back link */}
          <Link
            to="/Mentordashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition mb-6"
          >
            <ArrowLeft size={15} />
            Back to students
          </Link>

          {/* Student header */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl shrink-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 font-semibold text-xl">
                  {student.name? student.name.charAt(0).toUpperCase() : ''}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {student.name}
                  </h1>
                  <p className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1">
                    <Mail size={13} />
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Read-only notice — sets expectations up front */}
              <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/[0.03] border border-zinc-800 text-xs text-zinc-500">
                <Eye size={14} />
                Read-only view
              </div>
            </div>
          </section>

          {/* Quick stats for this student */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Total Applications</p>
                  <h2 className="text-3xl font-bold mt-2">{applications.length}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <BriefcaseBusiness size={19} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Interviewing</p>
                  <h2 className="text-3xl font-bold mt-2">{interviewCount}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <Clock3 size={19} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Offers</p>
                  <h2 className="text-3xl font-bold mt-2">{offerCount}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={19} />
                </div>
              </div>
            </div>
          </section>


          {/* =================================================
              STATUS BREAKDOWN + DONUT CHART
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

            {/* =================================================
                APPLICATION STATUS
            ================================================= */}

            <div
              className="
                bg-[#111111]/80
                backdrop-blur-xl
                border
                border-zinc-800
                rounded-2xl
                p-6
              "
            >

              <div>

                <h2 className="text-lg font-semibold">
                  Application Status
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Current application pipeline
                </p>

              </div>

              {/* Total */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mt-7
                  pb-5
                  border-b
                  border-zinc-800
                "
              >

                <div>

                  <p className="text-xs text-zinc-500">
                    Total
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {applications.length}
                  </p>

                </div>

                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <TrendingUp
                    size={21}
                    className="text-purple-400"
                  />
                </div>

              </div>

              {/* Status Rows */}

              <div className="space-y-6 mt-6">

                {statusData.map((status) => (

                  <div key={status.name}>

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-sm text-zinc-400">
                        {status.name}
                      </span>

                      <span
                        className={`
                          text-sm
                          font-medium
                          ${status.text}
                        `}
                      >
                        {status.count}
                      </span>

                    </div>

                    <div
                      className="
                        h-2
                        bg-zinc-800
                        rounded-full
                        overflow-hidden
                      "
                    >

                      <div
                        className={`
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          ${status.gradient}
                        `}
                        style={{
                          width:
                            applications.length > 0
                              ? `${(status.count / applications.length) * 100}%`
                              : "0%",
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>



{/* *****************Donut  */}
        <div
                      className="
                        bg-[#111111]/80
                        backdrop-blur-xl
                        border
                        border-zinc-800
                        rounded-2xl
                        p-6
                      "
                    >
        
                      <div>
        
                        <h2 className="text-lg font-semibold">
                          Application Distribution
                        </h2>
        
                        <p className="text-sm text-zinc-500 mt-1">
                          Breakdown of your applications by status
                        </p>
        
                      </div>
        
                      {/* Chart */}
        
                      <div className="relative h-[330px] mt-4">
        
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >
        
                          <PieChart>
        
                            <Pie
                              data={statusData}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={85}
                              outerRadius={150}
                              paddingAngle={3}
                              stroke="none"
                            >
        
                              {statusData.map((status) => (
        
                                <Cell
                                  key={status.name}
                                  fill={Donut_COLORS[status.name]}
                                />
        
                              ))}
        
                            </Pie>
        
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#111111",
                                border: "1px solid #27272a",
                                borderRadius: "12px",
                              }}
                              itemStyle={{
                                color: "#ffffff",
                              }}
                            />
        
                          </PieChart>
        
                        </ResponsiveContainer>
        
                        {/* Center of Donut */}
        
                        <div
                          className="
                            absolute
                            inset-0
                            flex
                            flex-col
                            items-center
                            justify-center
                            pointer-events-none
                          "
                        >
        
                          <p className="text-3xl font-bold">
                            {applications.length}
                          </p>
        
                          <p className="text-xs text-zinc-500 mt-1">
                            Total Applications
                          </p>
        
                        </div>
        
                      </div>
        
                      {/* Legend */}
        
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
        
                        {statusData.map((status) => (
        
                          <div
                            key={status.name}
                            className="flex items-center gap-2"
                          >
        
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  Donut_COLORS[status.name],
                              }}
                            />
        
                            <span className="text-xs text-zinc-400">
                              {status.name}
                            </span>
        
                            <span className="text-xs text-zinc-600">
                              {status.count}
                            </span>
        
                          </div>
        
                        ))}
        
                      </div>
        
                    </div>
                    </div><br />


          {/* Applications list */}
          <section className="rounded-2xl bg-[#11101a]/80 backdrop-blur-xl border border-zinc-800 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold">Applications</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Every application this student has tracked
                </p>
              </div>

              <div className="relative w-full sm:w-[280px]">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0d0c15] border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 hover:border-zinc-700"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-600">
                    <th className="px-5 py-3.5 text-left font-medium">Company</th>
                    <th className="px-5 py-3.5 text-left font-medium">Role</th>
                    <th className="px-5 py-3.5 text-center font-medium">Status</th>
                    <th className="px-5 py-3.5 text-left font-medium">Date Applied</th>
                    <th className="px-5 py-3.5 text-left font-medium">Notes</th>
                  </tr>
                </thead>

                <tbody>
                  
                  { loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-zinc-500">
                        Loading applications...
                      </td>
                    </tr>
                  ) :
                  filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-zinc-500">
                        No applications found for this student.
                      </td>
                    </tr>
                  ):
                  filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b border-zinc-800/70 hover:bg-white/[0.02] transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 text-sm font-semibold">
                            {application.company
                                ?.trim()
                                .charAt(0)
                                .toUpperCase()}
                          </div>
                          <p className="font-medium text-white">{application.company}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-zinc-300">{application.role}</p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-medium"
                          style={{
                            color: STATUS_COLORS[application.status],
                            borderColor: `${STATUS_COLORS[application.status]}33`,
                            backgroundColor: `${STATUS_COLORS[application.status]}1a`,
                          }}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-zinc-500">
                          {new Date(application.dateApplied).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-zinc-500 max-w-[220px] truncate">
                          {application.notes || "—"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state — no applications at all, or search matched nothing */}
            {/*
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-zinc-800 flex items-center justify-center mb-4">
                <BriefcaseBusiness size={20} className="text-zinc-500" />
              </div>
              <p className="text-sm font-medium">No applications found</p>
              <p className="text-sm text-zinc-500 mt-1 max-w-xs">
                This student hasn't logged any applications yet, or your search didn't match anything.
              </p>
            </div>
            */}
          </section>
        </div>
      </main>
    </div>
  );
}