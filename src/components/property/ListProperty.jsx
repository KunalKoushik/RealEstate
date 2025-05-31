import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListProperty = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("rental");
  const [category, setCategory] = useState("residential");
  const [price, setPrice] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [washrooms, setWashrooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const imageInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!type) newErrors.type = "Type is required.";
    if (!category) newErrors.category = "Category is required."; // Fix typo here
    if (!price || price <= 0) newErrors.price = "Valid price is required.";
    if (!longDescription.trim())
      newErrors.longDescription = "Long description is required.";
    if (!washrooms || washrooms <= 0)
      newErrors.washrooms = "Washrooms must be at least 1.";
    if (!bedrooms || bedrooms <= 0)
      newErrors.bedrooms = "Bedrooms must be at least 1.";
    if (!totalArea || totalArea <= 0)
      newErrors.totalArea = "Valid area is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!image) newErrors.image = "Please upload an image.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleCreateProperty = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("longDescription", longDescription);
    formData.append("washrooms", washrooms);
    formData.append("bedrooms", bedrooms);
    formData.append("totalArea", totalArea);
    formData.append("location", location);
    formData.append("image", image);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authorization token found. Please log in.");

      await axios.post(
        "http://localhost:4000/api/v1/property/createProperty",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Property listed successfully");

      setTitle("");
      setDescription("");
      setType("rental");
      setCategory("residential");
      setPrice("");
      setLongDescription("");
      setWashrooms("");
      setBedrooms("");
      setTotalArea("");
      setLocation("");
      setImage(null);
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";

      navigate("/properties");
    } catch (error) {
      alert(
        "Failed to list property: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 m-4 bg-white shadow-lg shadow-orange-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">List Property</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div>
  <label className="block text-lg font-medium mb-1">Type</label>
  <select
    className="w-full p-2 border rounded"
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <option value="" disabled>Select a type</option>
    <option value="rental">Rental</option>
    <option value="sale">Sale</option>
  </select>
  {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
</div>

        <div>
          <label className="block text-lg font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>
        <div>
          <label className="block text-lg font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
            className="w-full p-2 border rounded cursor-pointer"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {[
          {
            label: "Description",
            value: description,
            setter: setDescription,
            type: "text",
          },
          { label: "Price", value: price, setter: setPrice, type: "number" },
          {
            label: "Long Description",
            value: longDescription,
            setter: setLongDescription,
            type: "text",
          },
          {
            label: "Washrooms",
            value: washrooms,
            setter: setWashrooms,
            type: "number",
          },
          {
            label: "Bedrooms",
            value: bedrooms,
            setter: setBedrooms,
            type: "number",
          },
          {
            label: "Total Area",
            value: totalArea,
            setter: setTotalArea,
            type: "number",
          },
          {
            label: "Location",
            value: location,
            setter: setLocation,
            type: "text",
          },
        ].map(({ label, value, setter, type }, index) => (
          <div key={index}>
            <label className="block text-lg font-medium mb-1">{label}</label>
            <input
              type={type}
              className="w-full p-2 border rounded"
              placeholder={`Enter ${label.toLowerCase()}`}
              value={value}
              onChange={(e) => setter(e.target.value)}
            />
            {errors[label.toLowerCase()] && (
              <p className="text-red-500 text-sm">
                {errors[label.toLowerCase()]}
              </p>
            )}
          </div>
        ))}
        <div>
          <button
            onClick={handleCreateProperty}
            className="transition-transform duration-200 hover:scale-95 active:scale-110 w-full py-2 mb-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Uploading..." : "List Property"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListProperty;
