import { useEffect, useState } from "react";
import API from "../api/api";
import AppButton from "../components/common/AppButton";
import AppHeading from "../components/common/AppHeading";
import { FaUserCircle, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/user/profile");
        setForm(res.data);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await API.put("/user/profile", form);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordLoading(true);
      await API.put("/user/change-password", passwords);
      toast.success("Password updated successfully");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password update failed"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">

      {/* ================= PAGE HEADING ================= */}
      <AppHeading
        level={3}
        variant="primary"
        align="center"
        className="mb-10"
      >
        Profile Settings
      </AppHeading>

      <div className="grid md:grid-cols-2 gap-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border">

          <div className="flex items-center gap-4">
            <FaUserCircle className="text-4xl text-black-500" />
            <h3 className="text-xl font-semibold text-slate-800">
              Personal Information
            </h3>
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                name="email"
                value={form.email}
                disabled
                className="mt-1 w-full border rounded-lg px-4 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

          </div>

          <AppButton
            onClick={handleUpdate}
            disabled={loading}
            variant="primary"
            fullWidth
            className="rounded-lg"
          >
            {loading ? "Updating..." : "Update Profile"}
          </AppButton>

        </div>

        {/* ================= PASSWORD CARD ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border">

          <div className="flex items-center gap-4">
            <FaLock className="text-3xl text-black-500" />
            <h3 className="text-xl font-semibold text-slate-800">
              Change Password
            </h3>
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                New Password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none transition"
              />
            </div>

          </div>

          <AppButton
            onClick={handlePasswordChange}
            disabled={passwordLoading}
            variant="primary"
            fullWidth
            className="rounded-lg"
          >
            {passwordLoading ? "Updating..." : "Change Password"}
          </AppButton>

        </div>

      </div>
    </div>
  );
}

export default Profile;