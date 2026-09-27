import { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { Menu, User, Mail, Shield, Users, Save, KeyRound } from "lucide-react";
import AuthContext from "../../context/AuthContext.jsx";
import api from '../api/axios.js';
import toast from "react-hot-toast";


export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [mentors, setMentors] = useState([]); // populate via GET /api/mentors, same as signup
  const [name, setName] = useState(user.name);
  const [mentorId, setMentorId] = useState(user.mentorId ?? '');
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);


  async function fetchMentors()
  {
    try{
        const response = await api.get('/mentors');
        setMentors(response.data.mentors);
    }
    catch(err)
    {
        console.log(err);
        toast.error(err.response?.data?.message ||"Unable to fetch Mentors.");
    }
  }

  useEffect(()=>{
    fetchMentors();
  },[])


  async function handleProfileSave()
  {
    if(name.trim().length === 0)
    {
        setProfileErrors({name : "Name is Required"});
        return;
    }
    setSavingProfile(true);
    console.log(profileErrors);

    try
    {
        const response = await api.put('/auth/me', {name, mentorId});
        // setUser(response.data.user);
        console.log(response.data.user);
        toast.success("Profile Updated Successfully!");
    }
    catch(err)
    {
        console.log(err);
        toast.error(err.response?.data?.message || "Couldn't update Profile.");
    }
    finally
    {
        setSavingProfile(false);
    }
  }


  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  

  
    function validatePassword() 
    {
        const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        const newErrors = {};

        if(!passwordRegex.test(newPassword))
        {
            newErrors.newPassword = "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
        }

        if(newPassword !== confirmPassword)
        {
            newErrors.confirmPassword = " New Password and Confirm Password doesn't matches!";
        }

        setPasswordErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }


    async function handlePasswordSave()
    {
        if(!validatePassword())
        {
            return;
        }
        setSavingPassword(true);

        try
        {
            const response = await api.put('/auth/updatePassword', {currentPassword, newPassword});
            toast.success("Password Updated Successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        catch(err)
        {
            toast.error(err.response?.data?.message || "Couldn't Update Passwprd!");
        }
        finally{
            setSavingPassword(false);
        }
    }


  return (
    <div className="min-h-screen bg-[#05030f] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-purple-700/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-700/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] left-[35%] w-[350px] h-[350px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />

      <Sidebar
        active="/profile"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="md:ml-64 min-h-screen relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {/* Header */}
          <div className="flex items-start gap-3 mb-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mt-1 w-10 h-10 shrink-0 rounded-xl bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-purple-500/40 transition"
            >
              <Menu size={18} />
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Profile
              </h1>
              <p className="text-zinc-500 mt-2 text-sm md:text-base">
                Manage your account details and password.
              </p>
            </div>
          </div>

          {/* Avatar + identity summary */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/30 shrink-0">
              {user.name?.trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          {/* Profile details form */}
          <form
            onSubmit={(e)=>{ e.preventDefault(); handleProfileSave()}}
            className="bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-6"
          >
            <h2 className="text-lg font-semibold mb-1">Profile details</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Update your name{user.role === "student" ? " and mentor" : ""}. Email and role are fixed for your account.
            </p>

            <div className="space-y-4">
              {/* Name — editable */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[15px] text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>
                {profileErrors.name && (
                  <div className="mt-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                    {profileErrors.name}
                  </div>
                )}
              </div>

              {/* Email — read-only */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-[#151515] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[15px] text-zinc-500 outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-1.5">
                  Email can't be changed since it's tied to account verification.
                </p>
              </div>

              {/* Role — read-only, always */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <Shield
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    value={user.role === "mentor" ? "Mentor" : "Student"}
                    disabled
                    className="w-full bg-[#151515] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[15px] text-zinc-500 outline-none cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              {/* Mentor — editable dropdown, students only.
                  TODO: wrap this whole block in `{user.role === 'student' && (...)}`
                  so it doesn't render at all for mentor accounts. */}

                    {user.role === 'student' &&(

                        <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Mentor
                </label>
                <div className="relative">
                  <Users
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                  <select
                    name="mentorId"
                    value={mentorId}
                    onChange={(e) => setMentorId(e.target.value)}
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[15px] text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700 appearance-none"
                    >
                    {mentors.map((mentor) => (
                        <option key={mentor._id} value={mentor._id}>
                        {mentor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-zinc-600 mt-1.5">
                  Changing your mentor updates who can view your applications.
                </p>
              </div>
            )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-sm font-semibold shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-violet-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>

          {/* Change password form — separate card, separate action */}
          <form
            onSubmit={(e)=>{e.preventDefault(); handlePasswordSave()}}
            className="bg-[#111111]/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold mb-1">Change password</h2>
            <p className="text-sm text-zinc-500 mb-6">
              You'll need your current password to set a new one.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Current password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  required
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>
                {passwordErrors.newPassword && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                  {passwordErrors.newPassword}
                </div>
              )}

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#181818] border border-zinc-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 hover:border-zinc-700"
                  />
                </div>
              </div>
              {passwordErrors.confirmPassword && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                  {passwordErrors.confirmPassword}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                // TODO: disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-200 hover:text-white hover:border-zinc-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <KeyRound size={16} />
                {savingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}