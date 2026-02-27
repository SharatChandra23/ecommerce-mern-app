import { useEffect, useState } from "react";
import API from "../api/api";
import AddressModal from "./AddressModal";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadAddresses = async () => {
    const res = await API.get("/user/addresses");
    setAddresses(res.data);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const setDefault = async (id) => {
    await API.put(`/user/addresses/default/${id}`);
    loadAddresses();
  };

  const deleteAddress = async (id) => {
    await API.delete(`/user/addresses/${id}`);
    loadAddresses();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Addresses</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Address
      </button>

      <div className="grid gap-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border p-4 rounded shadow relative"
          >
            {addr.isDefault && (
              <span className="absolute top-2 right-2 text-xs bg-green-600 text-white px-3 py-1 rounded-full shadow">
                Default
              </span>
            )}

            <p>{addr.fullName}</p>
            <p>{addr.addressLine}</p>
            <p>{addr.city} - {addr.postalCode}</p>

            <div className="mt-3 flex gap-4">
              <button
                onClick={() => {
                  setEditData(addr);
                  setModalOpen(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteAddress(addr._id)}
                className="text-red-600"
              >
                Delete
              </button>

              <button
                onClick={() => setDefault(addr._id)}
                className="text-green-600"
              >
                Set Default
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddressModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        editData={editData}
        refresh={loadAddresses}
      />
    </div>
  );
}

export default Addresses;