import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function AddProduct() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/products", form);
        navigate("/admin/products");
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Add New Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "price", "image", "stock"].map((field) => (
                    <input
                        key={field}
                        type={field === "price" || field === "stock" ? "number" : "text"}
                        name={field}
                        placeholder={field.toUpperCase()}
                        value={form[field]}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                ))}

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition">
                    Add Product
                </button>
            </form>
        </div>
    );
}