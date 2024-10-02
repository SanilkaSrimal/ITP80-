import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Layout from "../../../layout/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { productCategory } from "../../../data/productCatogory";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const formSchema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  category: yup.string().required("category is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .min(0, "Quantity cannot be a negative number"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price cannot be a negative number"),
  processor: yup.string().required("Processor is required"),
  os: yup.string().required("OS is required"),
  graphics: yup.string().required("Graphics is required"),
  storage: yup.string().required("Storage is required"),
});

const EditProduct = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  console.log(product);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        const data = res.data.product;
        setProduct(data);
        if (data) {
          reset({
            productName: data.productName,
            category: data.category,
            quantity: data.quantity,
            price: data.price,
            processor: data.processor,
            os: data.os,
            graphics: data.graphics,
            storage: data.storage,
          });

          setImageBase64(data.image);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const onSubmit = async (data) => {
    if (!imageBase64) {
      return toast.error("Please upload an image");
    }

    const productData = {
      productName: data.productName,
      category: data.category,
      quantity: data.quantity,
      price: data.price,
      description: data.description,
      processor: data.processor,
      os: data.os,
      graphics: data.graphics,
      storage: data.storage,
      image: imageBase64,
      promotion: data.promotion,
    };

    try {
      await axios.put(`http://localhost:5000/products/${id}`, productData);

      toast.success("Product update successfully");
      navigate("/dashboard/products/list");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center p-3 h-full items-center">
        <div className="w-[900px] border-2 px-10 py-5 rounded-lg">
          <h1 className="text-lg ml-1 font-semibold text-gray-800">
            Edit Product
          </h1>
          <form
            className="mt-4 flex gap-2 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-5">
              <div className="flex-1">
                <label className="block text-sm  leading-6 text-gray-900">
                  Image Upload
                </label>
                <div className="flex items-center justify-center w-full mt-2">
                  {!imageBase64 && (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 ">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 ">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}

                  {imageBase64 && (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                      <img
                        className=" w-48 h-48"
                        src={imageBase64}
                        alt="Selected File"
                      />
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex-1 gap-2 flex flex-col">
                <Input
                  size="md"
                  variant="filled"
                  type="text"
                  className="text-sm "
                  label="Product name"
                  placeholder="Enter product name"
                  {...register("productName")}
                  isInvalid={errors.productName}
                  errorMessage={errors.productName?.message}
                />
                <Select
                  items={productCategory}
                  label="product Category"
                  placeholder="Select product Category"
                  variant="filled"
                  className="flex-1"
                  errorMessage={errors.category?.message}
                  {...register("category")}
                  isInvalid={errors.category}
                >
                  {productCategory.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex  gap-2">
                  <Input
                    size="md"
                    variant="filled"
                    type="number"
                    className="text-sm "
                    label="Product quantity"
                    placeholder="Enter product quantity"
                    {...register("quantity")}
                    isInvalid={errors.quantity}
                    errorMessage={errors.quantity?.message}
                  />
                  <Input
                    size="md"
                    variant="filled"
                    type="number"
                    className="text-sm "
                    label="Product price"
                    placeholder="Enter product price"
                    {...register("price")}
                    isInvalid={errors.price}
                    errorMessage={errors.price?.message}
                  />
                </div>
                <div className="flex  gap-2">
                  <Input
                    size="md"
                    variant="filled"
                    type="text"
                    className="text-sm "
                    label="Processor"
                    placeholder="Enter processor"
                    {...register("processor")}
                    isInvalid={errors.processor}
                    errorMessage={errors.processor?.message}
                  />
                  <Input
                    size="md"
                    variant="filled"
                    type="text"
                    className="text-sm "
                    label="OS"
                    placeholder="Enter product os"
                    {...register("os")}
                    isInvalid={errors.os}
                    errorMessage={errors.os?.message}
                  />
                </div>

                <div className="flex  gap-2">
                  <Input
                    size="md"
                    variant="filled"
                    type="text"
                    className="text-sm "
                    label="Graphics"
                    placeholder="Enter graphics"
                    {...register("graphics")}
                    isInvalid={errors.graphics}
                    errorMessage={errors.graphics?.message}
                  />
                  <Input
                    size="md"
                    variant="filled"
                    type="text"
                    className="text-sm "
                    label="Storage"
                    placeholder="Enter storage"
                    {...register("storage")}
                    isInvalid={errors.storage}
                    errorMessage={errors.storage?.message}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="large"
                className="bg-black text-white mt-2"
                loading={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default EditProduct;
