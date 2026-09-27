import { useState, useContext, useEffect } from "react";

import AuthContext from "../../context/AuthContext.jsx";
import api from "../api/axios.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";

import { Link } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

import {
  BriefcaseBusiness,
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

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Logged-in user
  const { user } = useContext(AuthContext);

  // -------------------------------------------------------
  // FETCH APPLICATIONS
  // -------------------------------------------------------

  async function getApplications() {
    try {
      const response = await api.get("/applications/");

      console.log(response.data.applications);

      setApplications(response.data.applications || []);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to fetch applications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getApplications();
  }, []);

  // -------------------------------------------------------
  // STATISTICS
  // -------------------------------------------------------

  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      icon: BriefcaseBusiness,
      iconStyle:
        "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },

    {
      title: "Online Assessments",
      value: applications.filter(
        (a) => a.status === "OA"
      ).length,
      icon: ClipboardCheck,
      iconStyle:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },

    {
      title: "Interviews",
      value: applications.filter(
        (a) => a.status === "Interview"
      ).length,
      icon: Clock3,
      iconStyle:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },

    {
      title: "Offers",
      value: applications.filter(
        (a) => a.status === "Offer"
      ).length,
      icon: CheckCircle2,
      iconStyle:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  // -------------------------------------------------------
  // APPLICATION STATUS DATA
  // IMPORTANT:
  // "style" was changed to "gradient"
  // because Recharts treats "style" specially.
  // -------------------------------------------------------

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

  const STATUS_COLORS = {
    Applied: "#3b82f6",
    OA: "#a855f7",
    Interview: "#eab308",
    Offer: "#10b981",
    Rejected: "#ef4444",
  };

  return (
    <div className="min-h-screen bg-[#05030f] text-white relative overflow-hidden">

      {/* =====================================================
          BACKGROUND GLOW EFFECTS
      ===================================================== */}

      <div
        className="
          fixed
          -top-40
          -right-40
          w-[500px]
          h-[500px]
          bg-purple-700/20
          blur-[150px]
          rounded-full
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          -bottom-40
          -left-40
          w-[500px]
          h-[500px]
          bg-blue-700/20
          blur-[150px]
          rounded-full
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          top-[40%]
          left-[35%]
          w-[350px]
          h-[350px]
          bg-purple-900/20
          blur-[150px]
          rounded-full
          pointer-events-none
        "
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        active="/dashboard"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="md:ml-64 min-h-screen relative z-10">

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">

          {/* =================================================
              TOP HEADER
          ================================================= */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-9 gap-4">

            {/* LEFT SIDE */}

            <div className="flex items-start gap-3">

              {/* Mobile Menu */}

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="
                  md:hidden
                  mt-1
                  w-10
                  h-10
                  shrink-0
                  rounded-xl
                  bg-[#111111]/80
                  backdrop-blur-xl
                  border
                  border-zinc-800
                  flex
                  items-center
                  justify-center
                  text-zinc-300
                  hover:text-white
                  hover:border-purple-500/40
                  transition
                "
              >
                <Menu size={18} />
              </button>

              <div>

                <p className="text-sm text-purple-400 mb-2">
                  Dashboard
                </p>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back, {user?.name || "User"}
                  <span className="ml-2">👋</span>
                </h1>

                <p className="text-zinc-500 mt-2 text-sm md:text-base">
                  Here's what's happening with your applications.
                </p>

              </div>
            </div>

            {/* =================================================
                HEADER ACTIONS
            ================================================= */}

            <div className="flex items-center gap-3 flex-wrap">

              {/* Add Application */}

              <Link
                to="/applications/new"
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  md:px-5
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-violet-600
                  hover:from-purple-500
                  hover:to-violet-500
                  shadow-lg
                  shadow-purple-500/20
                  transition-all
                  hover:scale-[1.02]
                "
              >
                <Plus size={18} />

                <span className="text-sm font-medium">
                  Add Application
                </span>
              </Link>

              {/* User */}

              <div
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-3
                  px-3
                  py-2
                  rounded-xl
                  bg-[#111111]/80
                  backdrop-blur-xl
                  border
                  border-zinc-800
                "
              >

                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-gradient-to-br
                    from-purple-500
                    to-blue-500
                    flex
                    items-center
                    justify-center
                    font-semibold
                  "
                >
                  {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>

                  <p className="text-sm font-medium">
                    {user?.name || "User"}
                  </p>

                  <p className="text-[11px] text-zinc-500">
                    {user?.role || "Student"}
                  </p>

                </div>

              </div>

            </div>
          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="
                    relative
                    overflow-hidden
                    bg-[#111111]/80
                    backdrop-blur-xl
                    border
                    border-zinc-800
                    rounded-2xl
                    p-6
                    hover:border-purple-500/30
                    transition-all
                    duration-300
                    group
                  "
                >

                  {/* Card Glow */}

                  <div
                    className="
                      absolute
                      -top-16
                      -right-16
                      w-36
                      h-36
                      bg-purple-600/10
                      blur-3xl
                      rounded-full
                      group-hover:bg-purple-600/15
                      transition
                    "
                  />

                  <div className="relative flex items-start justify-between">

                    <div>

                      <p className="text-sm text-zinc-500">
                        {stat.title}
                      </p>

                      <h2 className="text-3xl font-bold mt-3">
                        {stat.value}
                      </h2>

                    </div>

                    <div
                      className={`
                        w-12
                        h-12
                        rounded-xl
                        border
                        flex
                        items-center
                        justify-center
                        ${stat.iconStyle}
                      `}
                    >
                      <Icon size={21} />
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

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

            {/* =================================================
                DONUT CHART
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
                          fill={STATUS_COLORS[status.name]}
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
                          STATUS_COLORS[status.name],
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

          </div>

          {/* =================================================
              RECENT APPLICATIONS
          ================================================= */}

          <div
            className="
              mt-6
              bg-[#111111]/80
              backdrop-blur-xl
              border
              border-zinc-800
              rounded-2xl
              overflow-hidden
            "
          >

            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
                px-4
                sm:px-6
                py-5
                border-b
                border-zinc-800
                gap-3
              "
            >

              <div>

                <h2 className="text-base sm:text-lg font-semibold">
                  Recent Applications
                </h2>

                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Your latest job applications
                </p>

              </div>

              <Link
                to="/applications"
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  text-purple-400
                  hover:text-purple-300
                  transition
                  shrink-0
                "
              >
                View All
                <ChevronRight size={16} />
              </Link>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[640px]">

                <thead>

                  <tr className="border-b border-zinc-800">

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[11px]
                        font-medium
                        text-zinc-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Company
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[11px]
                        font-medium
                        text-zinc-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Role
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[11px]
                        font-medium
                        text-zinc-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[11px]
                        font-medium
                        text-zinc-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Date Applied
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-center
                        text-[11px]
                        font-medium
                        text-zinc-600
                        uppercase
                        tracking-wider
                      "
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* Loading */}

                  {loading ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="py-10"
                      >
                        <LoadingSpinner />
                      </td>

                    </tr>

                  ) : applications.length > 0 ? (

                    /* Applications */

                    applications.slice(0, 5).map((application) => (

                      <tr
                        key={application._id}
                        className="
                          border-b
                          border-zinc-800/70
                          hover:bg-white/[0.02]
                          transition
                        "
                      >

                        {/* Company */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-gradient-to-br
                                from-purple-500/20
                                to-blue-500/20
                                border
                                border-purple-500/20
                                flex
                                items-center
                                justify-center
                                text-purple-300
                                font-semibold
                              "
                            >
                              {application.company?.trim()
                                ? application.company
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()
                                : "?"}
                            </div>

                            <div>

                              <p className="text-sm font-medium">
                                {application.company}
                              </p>

                              <p className="text-xs text-zinc-600 mt-0.5">
                                Company
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Role */}

                        <td className="px-6 py-4">

                          <p className="text-sm text-zinc-300">
                            {application.role}
                          </p>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">

                          {application.status === "Applied" && (

                            <span
                              className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-blue-500/10
                                text-blue-400
                                border
                                border-blue-500/20
                              "
                            >
                              Applied
                            </span>

                          )}

                          {application.status === "OA" && (

                            <span
                              className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-purple-500/10
                                text-purple-400
                                border
                                border-purple-500/20
                              "
                            >
                              OA
                            </span>

                          )}

                          {application.status === "Interview" && (

                            <span
                              className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-yellow-500/10
                                text-yellow-400
                                border
                                border-yellow-500/20
                              "
                            >
                              Interview
                            </span>

                          )}

                          {application.status === "Offer" && (

                            <span
                              className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-emerald-500/10
                                text-emerald-400
                                border
                                border-emerald-500/20
                              "
                            >
                              Offer
                            </span>

                          )}

                          {application.status === "Rejected" && (

                            <span
                              className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-red-500/10
                                text-red-400
                                border
                                border-red-500/20
                              "
                            >
                              Rejected
                            </span>

                          )}

                        </td>

                        {/* Date */}

                        <td className="px-6 py-4">

                          <span className="text-sm text-zinc-500">

                            {application.dateApplied
                              ? new Date(
                                  application.dateApplied
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}

                          </span>

                        </td>

                        {/* Action */}

                        <td className="px-6 py-4 text-center">

                          <Link
                            to={`/applications/${application._id}`}
                            className="
                              inline-block
                              px-3
                              py-1.5
                              rounded-lg
                              text-xs
                              text-zinc-400
                              hover:text-white
                              hover:bg-white/5
                              border
                              border-transparent
                              hover:border-zinc-700
                              transition
                            "
                          >
                            View
                          </Link>

                        </td>

                      </tr>

                    ))

                  ) : (

                    /* No Applications */

                    <tr>

                      <td
                        colSpan={5}
                        className="
                          text-center
                          py-12
                          text-zinc-500
                        "
                      >
                        No applications found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-2
              mt-8
              pb-5
              text-xs
              text-zinc-600
              text-center
              sm:text-left
            "
          >

            <p>
              © 2026 JobTrack
            </p>

            <p>
              Stay consistent. Keep applying.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}