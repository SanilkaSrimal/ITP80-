import { Link } from "react-router-dom";
import Layout from "../../../layout/Layout";
import Supplier from "../../../assets/supplier.png";
import React from "react";
import supply from "../../../assets/approval.png";
import supplyChain from "../../../assets/supply-chain.png";

const Supply = () => {
  return (
    <Layout>
      <div className="flex flex-wrap justify-center gap-28  p-10 h-full items-center min-h-full">
        <Link
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
          to="/dashboard/supply/add"
        >
          <div className="flex  justify-center items-center h-full flex-col gap-6">
            <img src={Supplier} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Add Supplier
            </span>
          </div>
        </Link>
        <Link
          to="/dashboard/supply/list"
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
        >
          <div className="flex justify-center items-center h-full flex-col gap-6">
            <img src={supply} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Supplier List
            </span>
          </div>
        </Link>
        <Link
          to="/dashboard/supply/request-list"
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
        >
          <div className="flex justify-center items-center h-full flex-col gap-6">
            <img src={supplyChain} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Supply Request
            </span>
          </div>
        </Link>
      </div>
    </Layout>
  );
};
export default Supply;
