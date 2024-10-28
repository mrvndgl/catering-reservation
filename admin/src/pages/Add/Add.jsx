import React, { useState } from "react";
import "./Add.css";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Add = () => {
  const url = "http://localhost:4000";
  const [image, setImage] = useState(null); // Initialize as null
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Beef",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("image", image); // Append image file

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          category: "Beef",
        });
        setImage(null); // Reset image state
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred while adding food."); // Handle network error
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload area"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            id="product-name"
            placeholder="Type here"
            required
            autoComplete="off"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            id="product-description"
            rows="6"
            placeholder="Write content here"
            required
            autoComplete="off"
          />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
              id="product-category" // Added ID for better accessibility
              autoComplete="off" // Added autocomplete attribute
            >
              <option value="Beef">Beef</option>
              <option value="Pork">Pork</option>
              <option value="Chicken">Chicken</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Seafoods">Seafoods</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
