import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  employee: {
    type: String,
  },
  salary: {
    type: Number,
    required: [true, "Please provide a salary"],
  },
  basicSalary: {
    type: Number,
    required: [true, "Please provide a basic salary"],
  },
  allowances: {
    type: Number,
    required: [true, "Please provide an allowance"],
  },
  ot: {
    type: Number,
    required: [true, "Please provide an OT hours"],
  },
  otPay: {
    type: Number,
    required: [true, "Please provide an OT pay"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Salary = mongoose.model("Salary", SalarySchema);

export default Salary;
