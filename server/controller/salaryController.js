import Salary from "../model/Salary.js";

export const getSalary = async (req, res) => {
  try {
    const salary = await Salary.find();

    res.status(200).json({ salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalary = async (req, res) => {
  try {
    const salary = req.body;

    const newSalary = new Salary(salary);

    await newSalary.save();

    res.status(201).json({ salary: newSalary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findById(id);

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    res.status(200).json({ salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee, basicSalary, allowances, ot, otPay, date } = req.body;

    const salary = await Salary.findById(id);

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    salary.employee = employee || salary.employee;
    salary.basicSalary = basicSalary || salary.basicSalary;
    salary.allowances = allowances || salary.allowances;
    salary.ot = ot || salary.ot;
    salary.otPay = otPay || salary.otPay;
    salary.date = date || salary.date;

    const updatedSalary = await salary.save();

    res.status(200).json({ salary: updatedSalary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete salary

export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findByIdAndDelete(id);

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    res.status(200).json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
