import { Link } from "react-router-dom";
import Layout from "../../../layout/Layout";
import sales from "../../../assets/cargo_3045670.png";
const DeliveryManager = () => {
  return (
    <Layout>
      <div className="flex flex-wrap justify-center gap-28  p-10 h-full items-center min-h-full">
        <Link
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
          to="/dashboard/order/list"
        >
          <div className="flex  justify-center items-center h-full flex-col gap-6">
            <img src={sales} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Order Management
            </span>
          </div>
        </Link>
        {/* <Link
          to="/dashboard/salary/list"
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
        >
          <div className="flex justify-center items-center h-full flex-col gap-6">
            <img src={generateSalary} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Salary Payments
            </span>
          </div>
        </Link> */}
      </div>
    </Layout>
  );
};
export default DeliveryManager;
