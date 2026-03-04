import { useState, useEffect, useRef } from "react";
import API from "../api/api";
import AppButton from "../components/common/AppButton";

function AddressModal({ isOpen, onClose, editData, refresh }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
  });

  const addressRef = useRef(null);

  // Populate edit data
  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        postalCode: "",
      });
    }
  }, [editData]);

  // Google autocomplete
  useEffect(() => {
    if (!isOpen) return; // condition INSIDE effect

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    if (currentUser && currentUser?.name) {
      setForm({
        fullName: currentUser.name,
        phone: currentUser.phoneNumber || "7845153645",
        addressLine: "",
        city: "",
        postalCode: "",
      });
    }
    // if (!window.google || !addressRef.current) return;

    // const autocomplete = new window.google.maps.places.Autocomplete(
    //   addressRef.current,
    //   { types: ["address"] }
    // );

    // autocomplete.addListener("place_changed", () => {
    //   const place = autocomplete.getPlace();

    //   setForm(prev => ({
    //     ...prev,
    //     addressLine: place.formatted_address
    //   }));
    // });

  }, [isOpen]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (editData) {
      await API.put(`/user/addresses/${editData._id}`, form);
    } else {
      await API.post("/user/addresses", form);
    }

    refresh();
    onClose();
  };

  // AFTER hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {editData ? "Edit Address" : "Add Address"}
        </h3>

        <div className="space-y-3">
          <input
            disabled={true}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 w-full rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 w-full rounded"
          />

          {/* ref={addressRef} */}
          <input
            name="addressLine"
            value={form.addressLine}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 w-full rounded"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 w-full rounded"
          />

          <input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <AppButton onClick={onClose} variant="danger">
            Cancel
          </AppButton>
          <AppButton
            onClick={handleSubmit}
            variant="primary"
          >
            Save
          </AppButton>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;