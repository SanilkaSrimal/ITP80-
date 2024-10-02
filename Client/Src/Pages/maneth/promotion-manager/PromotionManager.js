import { Link } from "react-router-dom";
import Layout from "../../../layout/Layout";
import promo from "../../../assets/shopping-online_1260235.png";
import coupon from "../../../assets/coupon_2405948.png";
import couponList from "../../../assets/coupon.png";

const PromotionManager = () => {
  return (
    <Layout>
      <div className="flex flex-wrap justify-center gap-20  p-10 h-full items-center min-h-full">
        <Link
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
          to="/dashboard/promotion/items"
        >
          <div className="flex  justify-center items-center h-full flex-col gap-6">
            <img src={promo} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Promotion Items
            </span>
          </div>
        </Link>
        <Link
          to="/dashboard/promotion/coupon/add"
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
        >
          <div className="flex justify-center items-center h-full flex-col gap-6">
            <img src={coupon} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">Add Coupon</span>
          </div>
        </Link>
        <Link
          to="/dashboard/promotion/coupon/list"
          className="bg-blue-700 max-w-[300px] flex-1 h-72 rounded-lg shadow-lg cursor-pointer hover:bg-blue-800 transition duration-300 border-2 border-blue-800"
        >
          <div className="flex justify-center items-center h-full flex-col gap-6">
            <img src={couponList} alt="profile" className="h-32 w-32" />
            <span className="text-xl font-semibold text-white">
              Coupons
            </span>
          </div>
        </Link>
      </div>
    </Layout>
  );
};
export default PromotionManager;
