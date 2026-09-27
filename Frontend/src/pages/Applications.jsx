
import { useEffect, useState } from "react";

import { Link } from "react-router";

import api from "../api/axios.js";

import LoadingSpinner from "../components/LoadingSpinner.jsx";

import Sidebar from "../components/Sidebar.jsx";

import { useNavigate } from "react-router";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  User,
  Settings,
  LogOut,
  Bell,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  Menu,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

// Status options must match your Application model's enum exactly.
const STATUS_OPTIONS = [
  "All",
  "Applied",
  "OA",
  "Interview",
  "Offer",
  "Rejected",
];

export default function Applications() {
  const STATUS_STYLES = {
    Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    OA: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Interview: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  // ================= STATE =================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [deleteApplication, setDeleteApplication] = useState(null);

  const navigate = useNavigate();

  // ================= FETCH APPLICATIONS =================

  async function fetchApplications() {
    try {
      const res = await api.get("/applications/");

      setApplications(res.data.applications);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  // ================= SEARCH + FILTER =================

  const filteredApplications = applications.filter((application) => {
    const searchMatch =
      application.company
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      application.role
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      application.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // ================= DELETE APPLICATION =================

  async function handleDelete(id) {
    try {
      await api.delete("/applications/" + id);

      setApplications((prev) =>
        prev.filter((application) => application._id !== id)
      );

      toast.success("Application deleted successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't delete application. Try again."
      );
    }
  }

  // ================= JSX =================

  return (
    <div className="min-h-screen bg-[#05030f] text-white relative overflow-hidden">

      {/* =====================================================
          BACKGROUND GLOW EFFECTS
      ===================================================== */}

      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-purple-700/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-700/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="fixed top-[40%] left-[35%] w-[350px] h-[350px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        active="/applications"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="md:ml-64 min-h-screen relative z-10">

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">

          {/* ================= HEADER ================= */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">

            <div className="flex items-start gap-3">

              {/* Mobile menu */}

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden mt-1 w-10 h-10 shrink-0 rounded-xl bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purple-500/40 transition"
              >
                <Menu size={18} />
              </button>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Applications
                </h1>

                <p className="text-zinc-500 mt-2 text-sm md:text-base">
                  Every job and internship you've applied to, in one place.
                </p>

              </div>

            </div>

            {/* Add Application */}

            <Link
              to="/applications/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <Plus size={18} />

              <span className="text-sm font-medium">
                Add Application
              </span>

            </Link>

          </div>

          {/* =====================================================
              SEARCH + FILTER
          ===================================================== */}

          <div className="flex flex-col sm:flex-row gap-3 mb-6">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                placeholder="Search by company or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
              />

            </div>

            {/* Status Filter */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 outline-none transition focus:border-purple-500 hover:border-zinc-700 sm:w-48"
            >

              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "All"
                    ? "All statuses"
                    : option}
                </option>
              ))}

            </select>

          </div>

          {/* =====================================================
              APPLICATION TABLE
          ===================================================== */}

          <div className="bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                {/* ================= TABLE HEADER ================= */}

                <thead>

                  <tr className="border-b border-zinc-800">

                    <th className="px-6 py-4 text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      Company
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      Date Applied
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      Notes
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      Actions
                    </th>

                  </tr>

                </thead>

                {/* ================= TABLE BODY ================= */}

                <tbody>

                  {/* Loading */}

                  {loading ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-10"
                      >
                        <LoadingSpinner />
                      </td>

                    </tr>

                  ) : filteredApplications.length > 0 ? (

                    filteredApplications.map((application) => (

                      <tr
                        key={application._id}
                        className="border-b border-zinc-800/70 hover:bg-white/[0.02] transition"
                      >

                        {/* ================= COMPANY ================= */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 font-semibold">

                              {application.company
                                ?.trim()
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <p className="text-sm font-medium">
                              {application.company}
                            </p>

                          </div>

                        </td>

                        {/* ================= ROLE ================= */}

                        <td className="px-6 py-4">

                          <p className="text-sm text-zinc-300">
                            {application.role}
                          </p>

                        </td>

                        {/* ================= STATUS ================= */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              STATUS_STYLES[
                                application.status
                              ]
                            }`}
                          >
                            {application.status}
                          </span>

                        </td>

                        {/* ================= DATE APPLIED ================= */}

                        <td className="px-6 py-4">

                          <span className="text-sm text-zinc-500">

                            {application.dateApplied
                              ? new Date(
                                  application.dateApplied
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}

                          </span>

                        </td>

                        {/* ================= NOTES ================= */}

                        <td className="px-6 py-4">

                          <p
                            className="text-sm text-zinc-400 max-w-[250px] truncate"
                            title={
                              application.notes ||
                              "No notes"
                            }
                          >
                            {application.notes ||
                              "No notes"}
                          </p>

                        </td>

                        {/* ================= ACTIONS ================= */}

                        <td className="px-6 py-4">

                          <div className="flex items-center justify-end gap-2">

                            {/* View */}

                            <Link
                              to={`/applications/${application._id}`}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-zinc-700 transition"
                            >
                              <ExternalLink size={15} />
                            </Link>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteApplication(
                                  application
                                )
                              }
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition"
                            >
                              <Trash2 size={15} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    /* No applications */

                    <tr>

                      <td
                        colSpan={6}
                        className="text-center py-12 text-zinc-500"
                      >
                        No applications found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteApplication && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/50">

            {/* Icon */}

            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">

              <Trash2
                size={21}
                className="text-red-400"
              />

            </div>

            {/* Heading */}

            <h2 className="text-xl font-semibold text-white">
              Delete Application?
            </h2>

            {/* Message */}

            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">

              Are you sure you want to delete your application
              for{" "}

              <span className="text-white font-medium">
                {deleteApplication.role}
              </span>{" "}

              at{" "}

              <span className="text-purple-400 font-medium">
                {deleteApplication.company}
              </span>

              ? This action cannot be undone.

            </p>

            {/* Buttons */}

            <div className="flex justify-end gap-3 mt-7">

              <button
                type="button"
                onClick={() =>
                  setDeleteApplication(null)
                }
                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDelete(deleteApplication._id);
                  setDeleteApplication(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition"
              >
                Delete Application
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}