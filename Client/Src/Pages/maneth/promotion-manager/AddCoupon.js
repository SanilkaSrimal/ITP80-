import { Button, DatePicker, Input } from "@nextui-org/react";
import Layout from "../../../layout/Layout";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = yup.object().shape({
  couponCode: yup
    .string()
    .required("Coupon code is required")
    .min(5, "Coupon code must be at least 5 characters long"),
  discount: yup.string().required("Discount is required"),
  expiryDate: yup
    .date()
    .required("Expire date is required")
    .typeError("Invalid date"),
});

const AddCoupon = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/coupon", data);

      toast.success("Added successfully");

      navigate("/dashboard/promotion/coupon/list");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-center p-3 h-full items-center">
        <div className="w-[600px] border-2 px-10 py-5 rounded-lg">
          <h1 className="text-lg ml-2 font-semibold text-gray-800">
            Add Coupon
          </h1>
          <form
            className="mt-4 flex gap-2 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              size="md"
              variant="filled"
              type="text"
              className="text-sm"
              label="Coupon Code"
              placeholder="Enter coupon code"
              {...register("couponCode")}
              isInvalid={errors.couponCode}
              errorMessage={errors.couponCode?.message}
              fullWidth
              autoFocus
            />
            <Input
              size="md"
              variant="filled"
              type="number"
              label="Discount"
              className="text-sm"
              placeholder="Enter discount"
              {...register("discount")}
              isInvalid={errors.discount}
              errorMessage={errors.discount?.message}
              fullWidth
            />
            <Controller
              name="expiryDate"
              control={control}
              defaultValue={selectedDate}
              render={({ field }) => (
                <DatePicker
                  size="md"
                  variant="filled"
                  type="text"
                  label="Expire Date"
                  className="text-sm"
                  placeholder="Select expire date"
                  selected={field.value}
                  onChange={(date) => {
                    setSelectedDate(date);
                    field.onChange(date);
                  }}
                  isInvalid={errors.expiryDate}
                  errorMessage={errors.expiryDate?.message}
                  fullWidth
                />
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="large"
                className="bg-black text-white mt-2"
                loading={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddCoupon;
