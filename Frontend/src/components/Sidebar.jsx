// src/components/Sidebar.jsx
import { useState, useContext } from "react";
import { Link } from "react-router";
import AuthContext from "../../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import {
  LayoutDashboard, BriefcaseBusiness, Users, User, LogOut, X,
} from "lucide-react";

export default function Sidebar({ active, open, onClose }) {
  const { user, setUser } = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);

  // Role-aware nav — a mentor doesn't have their own "Applications" list,
  // and their dashboard route is different from a student's.
  // TODO: confirm these route paths match whatever you register in App.jsx
  // for the mentor dashboard (e.g. "/mentor-dashboard" vs "/dashboard").
  const isMentor = user?.role === "mentor";

  const NAV_ITEMS = isMentor
    ? [
        { to: "/Mentordashboard", label: "Dashboard", icon: LayoutDashboard },
      ]
    : [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/applications", label: "Applications", icon: BriefcaseBusiness },
      ];

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success("Logged out Successfully!");
    } catch (err) {
      toast.error("Couldn't log out. Try again.");
    } finally {
      setLogoutModal(false);
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-[#090810]/95 backdrop-blur-2xl
          border-r border-zinc-800/70 z-50 flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="px-6 py-7 flex items-center space-x-1.5">
          {/* <Link
            to={isMentor ? "/mentor-dashboard" : "/dashboard"}
            className="flex items-center gap-3"
            onClick={onClose}
          > */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/30">
              J
            </div>
            <div>
              <h1 className="text-xl font-semibold">JobTrack</h1>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                Career Tracker
              </p>
            </div>
          {/* </Link> */}

          <button
            type="button"
            onClick={onClose}
            className="md:hidden w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-4 mt-5">
          <p className="px-4 mb-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={
                  active === to
                    ? "group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/10 border border-purple-500/20 text-white shadow-lg shadow-purple-900/5"
                    : "group flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition"
                }
              >
                <Icon
                  size={19}
                  className={active === to ? "text-purple-400" : "group-hover:text-purple-400 transition"}
                />
                <span className={active === to ? "text-sm font-medium" : "text-sm"}>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mx-6 my-6 border-t border-zinc-800/70" />

        <div className="px-4">
          <p className="px-4 mb-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">
            Account
          </p>
          <nav className="space-y-1.5">
            <Link
              to="/profile"
              onClick={onClose}
              className={
                active === "/profile"
                  ? "group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/10 border border-purple-500/20 text-white"
                  : "group flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition"
              }
            >
              <User
                size={19}
                className={active === "/profile" ? "text-purple-400" : "group-hover:text-purple-400 transition"}
              />
              <span className="text-sm">Profile</span>
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-4">
          <button
            type="button"
            onClick={() => setLogoutModal(true)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut size={19} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {logoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setLogoutModal(false)}
          />
          <div className="relative w-full max-w-sm bg-[#11101a]/95 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl shadow-purple-950/30">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">Confirm Logout</h2>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                Are you sure you want to logout from your account?
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setLogoutModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold shadow-lg shadow-red-500/10 hover:from-red-500 hover:to-rose-500 hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}