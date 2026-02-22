import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function ProductList() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const { data } = await API.get("/products/admin");
        setProducts(data);
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
                <Link
                    to="/admin/add-product"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                    + Add Product
                </Link>
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
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td className="space-x-2">
                                    <Link
                                        to={`/admin/edit-product/${product._id}`}
                                        className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                    >
                                        Delete
                                    </button>
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
        </div>
    );
}