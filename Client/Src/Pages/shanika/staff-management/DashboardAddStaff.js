import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Layout from "../../../layout/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { EyeFilledIcon } from "../../../icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../../icon/EyeSlashFilledIcon";
import { roles } from "../../../data/roles";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required().min(3,"Enter user name more than 3 letters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be at most 12 digits"),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "password must match"),
});

const DashboardStaff = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/auth/register-admin", data);

      toast.success("Register successfully");

      navigate("/dashboard/staff/list");
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
            Add Staff
          </h1>
          <form
            className="mt-4 flex gap-2 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              size="md"
              variant="filled"
              type="text"
              className="text-sm "
              label="Username"
              placeholder="Enter  username"
              {...register("username")}
              isInvalid={errors.username}
              errorMessage={errors.username?.message}
            />
            <Input
              size="md"
              variant="filled"
              type="text"
              label="Email"
              className="text-sm "
              placeholder="Enter  email"
              {...register("email")}
              isInvalid={errors.email}
              errorMessage={errors.email?.message}
            />
            <Select
              items={roles}
              label="Role"
              placeholder="Select Role"
              variant="filled"
              className="flex-1"
              errorMessage={errors.role?.message}
              {...register("role")}
              isInvalid={errors.role}
            >
              {roles.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.value}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Phone Number"
              placeholder="Enter Phone Number"
              variant="filled"
              type="number"
              errorMessage={errors.phoneNumber?.message}
              {...register("phoneNumber")}
              isInvalid={errors.phoneNumber}
            />

            <Input
              size="md"
              variant="filled"
              label="Password"
              className="text-sm "
              placeholder="Enter your password"
              {...register("password")}
              isInvalid={errors.password}
              errorMessage={errors.password?.message}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="large"
                className="bg-blue-500 text-white mt-2"
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
export default DashboardStaff;
