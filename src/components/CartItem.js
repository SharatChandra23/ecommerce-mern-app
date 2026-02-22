import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function CartItem({ item }) {
    const { increaseQty, decreaseQty, removeItem } =
        useContext(CartContext);

    return (
        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-md mb-6">

            <div className="flex items-center gap-6">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                />

                <div>
                    <h4 className="font-semibold text-lg">
                        {item.name}
                    </h4>

                    <div className="flex items-center gap-4 mt-3">
                        <button
                            onClick={() => decreaseQty(item.id)}
                            className="bg-slate-900 text-white px-3 py-1 rounded"
                        >
                            -
                        </button>

                        <span className="text-lg">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => increaseQty(item.id)}
                            className="bg-slate-900 text-white px-3 py-1 rounded"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <p className="font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 mt-2 text-sm"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}

export default CartItem;