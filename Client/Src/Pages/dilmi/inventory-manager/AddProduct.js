// Importing necessary components and libraries
import { Button, Input, Select, SelectItem } from "@nextui-org/react"; // Import UI components from NextUI
import Layout from "../../../layout/Layout"; // Import a custom layout component for the page structure
import { useForm } from "react-hook-form"; // Import hook for form management
import { yupResolver } from "@hookform/resolvers/yup"; // Import Yup resolver to integrate Yup validation with react-hook-form
import * as yup from "yup"; // Import Yup for schema-based form validation
import { useState } from "react"; // Import useState hook for managing component state
import { productCategory } from "../../../data/productCatogory"; // Import product category options from a data file
import toast from "react-hot-toast"; // Import toast notification library for showing feedback messages
import axios from "axios"; // Import Axios for making HTTP requests to the backend
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for programmatic navigation (redirection)

// Define a Yup schema for form validation
const formSchema = yup.object().shape({
  productName: yup.string().required("Product name is required"), // Validate productName: must be a string and required
  category: yup.string().required("Category is required"), // Validate category: must be a string and required
  quantity: yup
    .number()
    .typeError("Quantity must be a number") // Ensure quantity is a number
    .required("Quantity is required") // Quantity is required
    .min(0, "Quantity cannot be a negative number"), // Minimum value for quantity is 0
  price: yup
    .number()
    .typeError("Price must be a number") // Ensure price is a number
    .required("Price is required") // Price is required
    .min(0, "Price cannot be a negative number"), // Minimum value for price is 0
  processor: yup.string().required("Processor is required"), // Processor field is required
  os: yup.string().required("OS is required"), // OS field is required
  graphics: yup.string().required("Graphics is required"), // Graphics field is required
  storage: yup.string().required("Storage is required"), // Storage field is required
});

// React component for adding a new product
const AddProduct = () => {
  // Define a state to store the uploaded image as a base64 string
  const [imageBase64, setImageBase64] = useState(null);

  // Initialize react-hook-form with validation using Yup resolver
  const {
    register, // Function to register form inputs for validation and management
    handleSubmit, // Function to handle form submission
    formState: { errors, isSubmitting }, // Object containing form state (errors and submission status)
  } = useForm({
    resolver: yupResolver(formSchema), // Integrate the Yup validation schema
  });

  const navigate = useNavigate(); // Hook to navigate to different routes after form submission

  // Function to handle form submission
  const onSubmit = async (data) => {
    if (!imageBase64) { // Check if an image is uploaded
      return toast.error("Please upload an image"); // Show an error if no image is uploaded
    }

    // Create a product object with form data and the uploaded image
    const productData = {
      productName: data.productName,
      category: data.category,
      quantity: data.quantity,
      price: data.price,
      processor: data.processor,
      os: data.os,
      graphics: data.graphics,
      storage: data.storage,
      image: imageBase64, // Add the uploaded image in base64 format
    };

    try {
      // Send a POST request to the backend to add the product
      const res = await axios.post("http://localhost:5000/products", productData);

      if (res.status === 201) { // Check if the product was successfully added
        toast.success("Product added successfully"); // Show success notification
        navigate("/dashboard/products/list"); // Redirect to the product list page
      }
    } catch (error) {
      // Show an error notification if something goes wrong
      toast.error(error.response.data.message);
    }
  };

  // Function to handle file upload for the image
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader(); // Create a FileReader to read the file
      reader.onload = (e) => {
        const base64String = e.target.result; // Convert the file into a base64 string
        setImageBase64(base64String); // Store the base64 image string in the component state
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64 format)
    }
  };

  return (
    <Layout> {/* Wrap the form in a layout component for consistent page structure */}
      <div className="flex justify-center p-3 h-full items-center">
        <div className="w-[900px] border-2 px-10 py-5 rounded-lg">
          <h1 className="text-lg ml-1 font-semibold text-gray-800">Add Product</h1>
          
          {/* Form for adding a product */}
          <form className="mt-4 flex gap-2 flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-5">
              <div className="flex-1">
                <label className="block text-sm leading-6 text-gray-900">Image Upload</label>
                <div className="flex items-center justify-center w-full mt-2">
                  {!imageBase64 && ( // If no image is uploaded, show the file upload prompt
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {/* SVG icon for file upload */}
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      {/* Input element for file upload */}
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}

                  {imageBase64 && ( // If an image is uploaded, show the preview
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                      <img className=" w-48 h-48" src={imageBase64} alt="Selected File" /> {/* Display selected image */}
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-1 gap-2 flex flex-col"> {/* Form inputs for product details */}
                <Input
                  size="md"
                  variant="filled"
                  type="text"
                  className="text-sm"
                  label="Product name"
                  placeholder="Enter product name"
                  {...register("productName")} // Register the input with react-hook-form
                  isInvalid={errors.productName} // Handle validation error if input is invalid
                  errorMessage={errors.productName?.message} // Display error message if any
                />
                <Select
                  items={productCategory} // Options for product categories
                  label="product Category"
                  placeholder="Select product Category"
                  variant="filled"
                  className="flex-1"
                  errorMessage={errors.category?.message} // Error message for invalid category
                  {...register("category")} // Register the select input
                  isInvalid={errors.category} // Handle validation error if input is invalid
                >
                  {productCategory.map((item) => ( // Map category options to select items
                    <SelectItem key={item.value} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex gap-2"> {/* Inputs for quantity and price */}
                  <Input
                    size="md"
                    variant="filled"
                    type="number"
                    className="text-sm"
                    label="Quantity"
                    placeholder="Enter quantity"
                    {...register("quantity")} // Register quantity input
                    isInvalid={errors.quantity} // Handle validation error for quantity
                    errorMessage={errors.quantity?.message} // Display error message if any
                  />
                  <Input
                    size="md"
                    variant="filled"
                    type="number"
                    className="text-sm"
                    label="Price"
                    placeholder="Enter price"
                    {...register("price")} // Register price input
                    isInvalid={errors.price} // Handle validation error for price
                    errorMessage={errors.price?.message} // Display error message if any
                  />
                </div>
              </div>
            </div>

            {/* Inputs for additional product specifications */}
            <div className="flex gap-5">
              <Input
                size="md"
                variant="filled"
                type="text"
                className="text-sm"
                label="Processor"
                placeholder="Enter processor"
                {...register("processor")} // Register processor input
                isInvalid={errors.processor} // Handle validation error for processor
                errorMessage={errors.processor?.message} // Display error message if any
              />
              <Input
                size="md"
                variant="filled"
                type="text"
                className="text-sm"
                label="OS"
                placeholder="Enter OS"
                {...register("os")} // Register OS input
                isInvalid={errors.os} // Handle validation error for OS
                errorMessage={errors.os?.message} // Display error message if any
              />
            </div>
            <div className="flex gap-5">
              <Input
                size="md"
                variant="filled"
                type="text"
                className="text-sm"
                label="Graphics"
                placeholder="Enter graphics"
                {...register("graphics")} // Register graphics input
                isInvalid={errors.graphics} // Handle validation error for graphics
                errorMessage={errors.graphics?.message} // Display error message if any
              />
              <Input
                size="md"
                variant="filled"
                type="text"
                className="text-sm"
                label="Storage"
                placeholder="Enter storage"
                {...register("storage")} // Register storage input
                isInvalid={errors.storage} // Handle validation error for storage
                errorMessage={errors.storage?.message} // Display error message if any
              />
            </div>

            {/* Submit button */}
            <Button
              isLoading={isSubmitting} // Show loading state if form is submitting
              className="text-md"
              color="primary"
              variant="shadow"
              type="submit"
            >
              Add Product
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct; // Export the AddProduct component for use in other parts of the app
