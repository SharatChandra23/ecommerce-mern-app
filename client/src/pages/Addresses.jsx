import { useEffect, useState } from "react";
import API from "../api/api";
import AddressModal from "./AddressModal";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import AppButton from "../components/common/AppButton";
import AppHeading from "../components/common/AppHeading";

function Addresses({
  type = "profile",
  selectedAddressId,
  onSelectAddress
}) {
  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const isCheckout = type === "checkout";

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
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">

      {/* Heading Row */}
      <div className="flex items-center justify-between mb-10">

        <AppHeading
          level={4}
          align="center"
          variant="primary"
        >
          {isCheckout ? "Shipping Address" : "My Addresses"}
        </AppHeading>


        <AppButton
          onClick={() => setModalOpen(true)}
          variant="primary"
          icon={<FaPlus size={12} />}
        >
          Add Address
        </AppButton>
      </div>

      <div className="grid gap-6">

        {addresses.map((addr) => (
          <div
            key={addr._id}
            onClick={() => isCheckout && onSelectAddress(addr._id)}
            className={`relative p-6 rounded-xl border bg-white
            transition-all duration-300 shadow-sm cursor-pointer
            transition-all duration-300 ease-in-out
            ${isCheckout && selectedAddressId === addr._id
                ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                : "hover:shadow-md"
              }`}>

            {/* Default Badge */}
            {addr.isDefault && (
              <span className="absolute top-5 right-5 text-xs bg-green-600 text-white px-3 py-1 rounded-full shadow">
                Default
              </span>
            )}

            <div className="flex gap-4 items-start">

              {/* Address Icon */}
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <FaMapMarkerAlt size={18} />
              </div>

              {/* Address Info */}
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {addr.fullName}
                </p>
                <p className="text-gray-600 mt-1">
                  {addr.addressLine}
                </p>
                <p className="text-gray-600">
                  {addr.city} - {addr.postalCode}
                </p>

                {/* Profile Actions */}
                {!isCheckout && (
                  <div className="mt-5 flex gap-4">

                    <AppButton
                      icon={<FaEdit size={12} />}
                      onClick={() => {
                        setEditData(addr);
                        setModalOpen(true);
                      }}
                      variant="primary">
                      Edit
                    </AppButton>

                    <AppButton
                      onClick={() => deleteAddress(addr._id)}
                      variant="danger"
                      icon={<FaTrash size={12} />}>
                      Delete
                    </AppButton>

                    {!addr.isDefault && (
                      <AppButton
                        onClick={() => setDefault(addr._id)}
                        variant="success"
                        icon={<FaCheck size={12} />}
                      >
                        Set Default
                      </AppButton>
                    )}

                  </div>
                )}

              </div>
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