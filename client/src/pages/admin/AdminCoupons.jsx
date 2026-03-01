import { useEffect, useState } from "react";
import API from "../../api/api";
import toast from "react-hot-toast";
import AppButton from "../../components/common/AppButton";
import { FaEdit, FaTicketAlt, FaTrash } from "react-icons/fa";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [form, setForm] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
        usageLimit: ""
    });

    const loadCoupons = async () => {
        try {
            const res = await API.get(
                `/coupons?page=${page}&search=${search}&status=${status}`
            );
            setCoupons(res.data.coupons);
            setPages(res.data.pages);
        } catch (err) {
            toast.error("Failed to load coupons");
        }
    };

    useEffect(() => {
        loadCoupons();
    }, [page, search, status]);

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                discountValue: Number(form.discountValue),
                minOrderAmount: Number(form.minOrderAmount || 0),
                usageLimit: Number(form.usageLimit || 1)
            };

            if (editingCoupon) {
                await API.put(`/coupons/${editingCoupon._id}`, payload);
                toast.success("Coupon updated");
            } else {
                await API.post("/coupons", payload);
                toast.success("Coupon created");
            }

            setShowModal(false);
            loadCoupons();

        } catch (err) {
            toast.error(err.response?.data?.message || "Error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/coupons/${id}`);
            toast.success("Coupon deactivated");
            loadCoupons();
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Coupons</h2>
                <AppButton
                    onClick={() => {
                        setForm({});
                        setEditingCoupon(null);
                        setShowModal(true);
                    }}
                    variant="orange"
                    icon={<FaTicketAlt size={16} />}
                >
                    Create Coupon
                </AppButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <input
                    placeholder="Search coupon..."
                    className="border px-3 py-2 rounded-lg"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="border px-3 py-2 rounded-lg"
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                </select>
            </div>

            {/* Table */}
            <table className="w-full border rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Code</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Usage</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((c) => (
                        <tr key={c._id} className="border-t">
                            <td className="p-3 font-semibold">{c.code}</td>
                            <td>{c.discountType}</td>
                            <td>{c.discountValue}</td>
                            <td>{c.usedCount}/{c.usageLimit}</td>
                            <td>{new Date(c.expiryDate).toDateString()}</td>
                            <td>
                                {c.isActive ? "Active" : "Inactive"}
                            </td>
                            <td className="space-x-2">
                                <AppButton
                                    variant="yellow"
                                    icon={<FaEdit size={16} />}
                                    onClick={() => {
                                        setForm(c);
                                        setEditingCoupon(c);
                                        setShowModal(true);
                                    }}
                                >
                                    Edit
                                </AppButton>
                                <AppButton
                                    variant="danger"
                                    icon={<FaTrash size={16} />}
                                    onClick={() => handleDelete(c._id)}
                                >
                                    Delete
                                </AppButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-2">
                {[...Array(pages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded ${page === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal Box */}
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6 z-50 animate-fadeIn">

                        <h3 className="text-xl font-bold mb-4">
                            {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                        </h3>

                        <div className="space-y-4">

                            <input
                                type="text"
                                placeholder="Coupon Code"
                                className="border p-2 w-full rounded"
                                value={form.code || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                                    })
                                }
                            />

                            <select
                                className="border p-2 w-full rounded"
                                value={form.discountType}
                                onChange={(e) =>
                                    setForm({ ...form, discountType: e.target.value })
                                }
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Discount Value"
                                className="border p-2 w-full rounded"
                                value={form.discountValue || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        discountValue: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Minimum Order Amount"
                                className="border p-2 w-full rounded"
                                value={form.minOrderAmount || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        minOrderAmount: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Usage Limit"
                                className="border p-2 w-full rounded"
                                value={form.usageLimit || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        usageLimit: e.target.value
                                    })
                                }
                            />

                            <input
                                type="date"
                                className="border p-2 w-full rounded"
                                value={form.expiryDate?.split("T")[0] || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        expiryDate: e.target.value
                                    })
                                }
                            />

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.isActive ?? true}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            isActive: e.target.checked
                                        })
                                    }
                                />
                                <label>Active</label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-4">
                                <AppButton
                                    variant="danger"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </AppButton>

                                <AppButton
                                    onClick={handleSubmit}
                                    variant="orange"
                                >
                                    Save Coupon
                                </AppButton>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}