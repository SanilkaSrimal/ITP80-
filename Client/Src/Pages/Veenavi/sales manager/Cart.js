import { useEffect, useState } from "react";
import NavBar from "../../../components/HomeNavBar";
import { Link } from "react-router-dom";
import { useGlobalReefetch } from "../../../store/Store";
import CheckOutModal from "./CheckOutModal";
import { useDisclosure } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [savings, setSavings] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const { globalRefetch, setGlobalRefetch } = useGlobalReefetch();
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const getCart = async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(cart);
    };
    getCart();
  }, [globalRefetch]);

  const handleIncrement = (id) => {
    const updatedCart = cart.map((product) => {
      if (product.id === id) {
        product.selectedQuantity += 1;
      }
      return product;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrement = (id) => {
    const updatedCart = cart.map((product) => {
      if (product.id === id) {
        if (product.selectedQuantity > 1) {
          product.selectedQuantity -= 1;
        }
      }
      return product;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setGlobalRefetch(!globalRefetch);
  };

  useEffect(() => {
    const calculateOriginalPrice = () => {
      const originalPrice = cart.reduce((acc, item) => {
        return acc + item.price * item.selectedQuantity;
      }, 0);
      setOriginalPrice(originalPrice);
    };

    const calculationDiscountPrice = () => {
      const discountPrice = cart.reduce((acc, item) => {
        return (
          acc + ((item.price * item.discount) / 100) * item.selectedQuantity
        );
      }, 0);

      setSavings(discountPrice);
    };

    calculateOriginalPrice();
    calculationDiscountPrice();
  }, [cart]);

  const { isOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setTotal(originalPrice - savings - couponDiscount);
  }, [originalPrice, savings, couponDiscount]);

  const addCoupon = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/coupon/valid-coupon",
        {
          couponCode: coupon,
        }
      );

      if (res.data.coupon) {
        const couponDiscount = res.data.coupon.discount;
        const expiryDate = res.data.coupon.expiryDate;

        if (new Date(expiryDate) < new Date()) {
          toast.error("Coupon has expired");
        } else {
          setCouponDiscount((total * couponDiscount) / 100);
          toast.success("Coupon Applied Successfully");
        }
      }
    } catch (error) {
      toast.error("Invalid Coupon Code");
      setCouponDiscount(0);
    }
  };

  return (
    <>
      <NavBar />
      <section className="bg-white py-8 antialiased  md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">
            Shopping Cart
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div classNameName="">
              {cart.length > 0 ? (
                cart.map((product) => (
                  <div className="mx-auto w-[800px] flex-none mt-5">
                    <div className="space-y-6">
                      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm ">
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <div className="shrink-0 md:order-1">
                            <img
                              src={product.image}
                              alt=""
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          </div>

                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => handleDecrement(product.id)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 "
                              >
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 "
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 2"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 1h16"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                id="counter-input"
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 "
                                placeholder=""
                                required
                                value={product.selectedQuantity}
                              />
                              <button
                                type="button"
                                onClick={() => handleIncrement(product.id)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 "
                              >
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 "
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 1v16M1 9h16"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 ">
                                LKR.{" "}
                                {(
                                  product.price * product.selectedQuantity
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                              </p>
                            </div>
                          </div>

                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <div
                              href="#"
                              className="text-base font-medium text-gray-900 hover:underline "
                            >
                              {product.name}
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleRemove(product.id)}
                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                              >
                                <svg
                                  className="me-1.5 h-5 w-5"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mx-auto w-[800px] flex-none mt-5">
                  <p>Your cart is currently empty.</p>
                </div>
              )}
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm  sm:p-6">
                <p className="text-xl font-semibold text-gray-900 ">
                  Order summary
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 ">
                        Original price
                      </dt>
                      <dd className="text-base font-medium text-gray-900 ">
                        LKR.{" "}
                        {originalPrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 ">
                        Savings
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        LKR.{" "}
                        {savings.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 ">
                        Coupon Discount
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        LKR.{" "}
                        {couponDiscount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 ">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 ">
                      LKR.{" "}
                      {total > 0
                        ? total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : 0}
                    </dd>
                  </dl>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    onOpenChange();
                  }}
                  className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white  ${
                    cart.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                  }`}
                >
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 ">
                    {" "}
                    or{" "}
                  </span>
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                    to="/"
                  >
                    Continue Shopping
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm  sm:p-6">
                <form className="space-y-4">
                  <div>
                    <label
                      for="voucher"
                      className="mb-2 block text-sm font-medium text-gray-900 "
                    >
                      {" "}
                      Do you have a voucher or gift card?{" "}
                    </label>
                    <input
                      type="text"
                      id="voucher"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 "
                      placeholder=""
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium ${
                      cart.length === 0
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    }`}
                    onClick={cart.length === 0 ? "" : addCoupon}
                  >
                    Apply Code
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CheckOutModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        cart={cart}
        setCart={setCart}
        setGlobalRefetch={setGlobalRefetch}
        originalPrice={originalPrice}
        savings={savings}
        total={total}
      />
    </>
  );
};
export default Cart;
