import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await API.get(`/products/${id}`);
            setForm(data);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.put(`/products/${id}`, form);
        navigate("/admin/products");
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Update Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "price", "image", "stock"].map((field) => (
                    <input
                        key={field}
                        type={field === "price" || field === "stock" ? "number" : "text"}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                ))}

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition">
                    Update Product
                </button>
            </form>
        </div>
    );
}