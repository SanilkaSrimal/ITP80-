import React from "react";
import { Link } from "react-router-dom";

function HeadLineCards({ setLoading, product }) {
  return (
    <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-5 gap-6">
      {/* card */}
      {product.map((p, index) => {
        return (
          <Link
            to={`/product/${p._id}`}
            className="rounded-xl relative  hover:scale-105 duration-300 "
          >
            {/* overlay */}
            <div className="absolute w-full h-full bg-black/30 rounded-xl text-white ">
              <p className="font-bold text-2xl px-2 pt-4">{p.productName}</p>

              <button className="mx-2 absolute bottom-4 bg-white text-black border border-white rounded-xl px-5 py-1">
                Order Now
              </button>
              <div className=" bg-white w-[150px] flex justify-center ml-3 rounded-lg">
                <p className=" text-blue-600">
                  LKR.{" "}
                  {p.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <img
              className="max-h-[250px] md:max-h-[500px] w-full object-cover rounded-xl"
              src={p.image}
            />
          </Link>
        );
      })}

      {/* card */}
    </div>
  );
}

export default HeadLineCards;
