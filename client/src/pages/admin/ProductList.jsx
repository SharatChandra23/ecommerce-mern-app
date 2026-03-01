import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import AppButton from "../../components/common/AppButton";
import { FaPlus } from "react-icons/fa";

export default function ProductList() {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        const { data } = await API.get("/products");
        setProducts(data?.products || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure?")) {
            await API.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Products</h2>

                <AppButton
                    onClick={() => navigate("/admin/add-product")}
                    variant="primary"
                    icon={<FaPlus size={16} />}
                >
                    Add Product
                </AppButton>
            </div>

            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-t">
                                <td className="p-4">
                                    <img
                                        src={`${BASE_URL}${product.image}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td className="space-x-2">
                                    <AppButton
                                        onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                        variant="yellow"
                                    >
                                        Edit
                                    </AppButton>
                                    <AppButton
                                        onClick={() => deleteProduct(product._id)}
                                        variant="danger"
                                    >
                                        Delete
                                    </AppButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No Products Found
                    </div>
                )}
            </div>
        </div >
    );
}