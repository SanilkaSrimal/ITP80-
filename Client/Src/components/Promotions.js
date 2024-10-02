import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Promotions = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProduct(data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, []);
  return (
    <div>
      <div className="bg-gray-500 p-10">
        <p className=" text-orange-600 font-bold text-6xl mb-10">Promotions</p>

        <div className="text-white  gap-10 grid md:grid-cols-4">
          {product.map((p, index) =>
            p.discount > 0 ? (
              <div className="rounded-xl relative" key={index}>
                <div className="w-full h-full bg-black/30 rounded-xl text-white p-3">
                  <div className="bg-red-600 mb-2 rounded-full w-[80px] h-[80px] flex items-center justify-center text-4xl font-bold">
                    {p.discount}%
                  </div>

                  <div className=" w-full h-[300px]">
                    <img
                      className="h-full w-full object-fill rounded-xl"
                      src={p.image}
                      alt={p.productName}
                    />
                  </div>
                  <p className="font-bold text-lg px-2 pt-4">{p.productName}</p>
                  <div className="p-3">
                    <span className="flex items-center gap-3">
                      <p className="text-lg font-bold">Processor:</p>
                      {p.processor}
                    </span>
                    <span className="flex items-center gap-3">
                      <p className="text-lg font-bold">OS:</p> {p.os}
                    </span>
                    <span className="flex items-center gap-3">
                      <p className="text-lg font-bold">Graphics:</p>{" "}
                      {p.graphics}
                    </span>
                    <span className="flex items-center gap-3">
                      <p className="text-lg font-bold">Storage:</p> {p.storage}
                    </span>
                    <div className="flex  gap-3">
                      <p className="text-lg font-bold">Price:</p>
                      <div>
                        <div className="line-through">
                          LKR.
                          {p.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>

                        <div>
                          <div className="text-orange-600 text-2xl">
                            LKR.
                            {(
                              p.price -
                              (p.price * p.discount) / 100
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to={`/product/${p._id}`}>
                    <button className="mx-2 bottom-4 bg-white text-black border border-white rounded-xl px-5 py-1">
                      Order Now
                    </button>
                  </Link>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
