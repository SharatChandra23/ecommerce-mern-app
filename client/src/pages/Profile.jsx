import { useEffect, useState } from "react";
import API from "../api/api";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handlePasswordChange = async () => {
    await API.put("/user/change-password", passwords);
    alert("Password updated");
  };

  useEffect(() => {
    const loadProfile = async () => {
      const res = await API.get("/user/profile");
      setForm(res.data);
    };
    loadProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setLoading(true);
    await API.put("/user/profile", form);
    setLoading(false);
    alert("Profile updated");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <div className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="email"
          value={form.email}
          disabled
          className="border p-2 rounded w-full bg-gray-100"
        />

        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
}

export default Profile;