import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import UserDash from "../../UserDash";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const formSchema = yup.object().shape({
  productID: yup.string().required("Product ID is required"),
  productName: yup.string().required("Product Name is required"),
  productPurchasedDate: yup
    .date()
    .required("Expire date is required")
    .typeError("Invalid date"),
  productWarrantyPeriod: yup
    .string()
    .required("Product warranty Period is required"),
  claimDescription: yup.string().min(10,"Description should be more than 10 letters").required("Claim Description is required"),
});

const UserService = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));

    if (user) {
      setUser(user);
    }
  }, []);

  const onSubmit = async (data) => {
    data.user = user._id;

    try {
      await axios.post("http://localhost:5000/service", data);

      toast.success("Claim submitted successfully");
      navigate("/user/service/previous-claims");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <UserDash>
      <div className="w-[60%]">
        <div>
          <div className="flex justify-between mb-5 items-center">
            <h1 className="text-center  text-xl">Claim Your Warranty</h1>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-5">
              <Input
                label="Product ID"
                type="text"
                placeholder="Enter Product ID"
                className=""
                {...register("productID")}
                isInvalid={errors.productID}
                errorMessage={errors.productID?.message}
              />
              <Input
                label="Product Name"
                type="text"
                placeholder="Enter Product Name"
                className=""
                {...register("productName")}
                isInvalid={errors.productName}
                errorMessage={errors.productName?.message}
              />
            </div>
            <div className="flex gap-5">
              <Controller
                name="productPurchasedDate"
                control={control}
                defaultValue={selectedDate}
                render={({ field }) => (
                  <DatePicker
                    size="md"
                    type="text"
                    label="Product Purchased Date"
                    className="text-sm"
                    placeholder="Select Product Purchased Date"
                    selected={field.value}
                    onChange={(date) => {
                      setSelectedDate(date);
                      field.onChange(date);
                    }}
                    isInvalid={errors.productPurchasedDate}
                    errorMessage={errors.productPurchasedDate?.message}
                    fullWidth
                  />
                )}
              />
              <Input
                label="Product warranty Period"
                type="text"
                placeholder="Enter Product warranty Period"
                className=""
                {...register("productWarrantyPeriod")}
                isInvalid={errors.productWarrantyPeriod}
                errorMessage={errors.productWarrantyPeriod?.message}
              />
            </div>
            <Textarea
              label="Claim Description"
              placeholder="Enter Claim Description"
              className=""
              {...register("claimDescription")}
              isInvalid={errors.claimDescription}
              errorMessage={errors.claimDescription?.message}
            />
            <div className="flex justify-end gap-5">
              <Link
                to="/user/service/previous-claims"
                className="mt-5 px-10 w-[200px] h-[40px] bg-red-500 rounded-xl text-white justify-center items-center flex text-sm"
                color="primary"
              >
                Your Services
              </Link>
              <Button type="submit" className="mt-5 px-10" color="primary">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UserDash>
  );
};
export default UserService;
