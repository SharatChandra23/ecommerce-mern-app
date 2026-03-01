import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

const FileUpload = ({
  label = "Upload Image",
  name,
  accept = "image/*",
  onChange,
  error,
  defaultImage
}) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(defaultImage || null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (file) => {
    if (!file || !(file instanceof File)) return;

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const removeFile = () => {
    setPreview(null);
    setFileName("");
    inputRef.current.value = "";
    if (onChange) onChange(null);
  };

  useEffect(() => {
    setPreview(defaultImage || null);
  }, [defaultImage]);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-all bg-gray-50"
      >
        {!preview ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <UploadCloud size={40} />
            <p className="font-medium">
              Drag & Drop or Click to Upload
            </p>
            <p className="text-sm text-gray-400">
              JPG, PNG, WEBP (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 object-cover rounded-lg shadow"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
            >
              <X size={16} />
            </button>
            <p className="mt-2 text-sm text-gray-600">{fileName}</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;