import { useEffect, useState } from "react";
import API from "../../api/api";
import FileUpload from "../../components/common/FileUpload";
import AppButton from "../../components/common/AppButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductForm({ mode = "add", productId }) {
    const navigate = useNavigate();
    const isEdit = mode === "edit";

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        discountPrice: "",
        description: "",
        stock: "",
        rating: "4",
        category: "",
    });

    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await API.get("/categories");
            setCategories(data);
        };
        loadCategories();
    }, []);

    // Load product for edit
    useEffect(() => {
        if (!isEdit) return;

        const fetchProduct = async () => {
            const { data } = await API.get(`/products/${productId}`);

            setForm({
                name: data.name,
                price: data.price,
                discountPrice: data.discountPrice,
                description: data.description,
                stock: data.stock,
                rating: data.rating,
                category: data.category?._id || data.category,
            });

            if (data.image) {
                setExistingImage(data.image);
            }
        };

        fetchProduct();
    }, [isEdit, productId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            Object.keys(form).forEach((key) => {
                data.append(key, form[key]);
            });

            if (image) {
                data.append("image", image);
            }

            if (isEdit) {
                await API.put(`/products/${productId}`, data);
                toast.success("Product updated successfully");
            } else {
                await API.post("/products", data);
                toast.success("Product created successfully");
            }
            navigate("/admin/products");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isEdit ? "Update Product" : "Add New Product"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Fill in product details below
                    </p>
                </div>

                <form className="space-y-8">

                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="form-label">Product Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Category</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Pricing & Stock
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div>
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Discount Price</label>
                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={form.discountPrice}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <label className="form-label">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Available quantity"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="form-input h-28 resize-none"
                            placeholder="Write product description..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Product Image
                        </h3>

                        <div className="bg-gray-50 p-6 rounded-2xl border">
                            <FileUpload
                                label=""
                                defaultImage={existingImage}
                                onChange={(file) => setImage(file)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <AppButton
                            onClick={handleSubmit}
                            variant="primary"
                            fullWidth
                            disabled={loading}

                            className="py-3 text-lg rounded-xl"
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                    ? "Update Product"
                                    : "Add Product"}
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    );
}