import React, { useEffect, useRef } from "react";
import { useState } from "react";

import { FaUserCircle } from "react-icons/fa";
import {
  AiFillTag,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineSearch,
} from "react-icons/ai";
import { BsFillCartFill, BsFillSaveFill } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { MdFavorite, MdHelp } from "react-icons/md";
import { FaUserFriends, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useGlobalReefetch } from "../store/Store";

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const { globalRefetch, setGlobalRefetch } = useGlobalReefetch();
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [searchProducts, setSearchProducts] = useState([]);
  const searchRef = useRef(null);
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (!user) {
      window.location.href = "/login";
    }

    setUser(JSON.parse(user));

    const cart = localStorage.getItem("cart");
    setCart(JSON.parse(cart));
  }, [globalRefetch]);


  useEffect(() => {
    if (search.length > 1) {
      const timeoutId = setTimeout(() => {
        setDebouncedSearch(search);
      }, 200);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setDebouncedSearch(""); 
      setSearchProducts([]); 
    }
  }, [search]);

  
  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/products?search=${debouncedSearch}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSearchProducts(data.products);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch products:", error);
        }
      }
    };

    if (debouncedSearch) {
      fetchProducts();
    }

    return () => {
      controller.abort();
    };
  }, [debouncedSearch]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocus(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4">
      {/* left side */}
      <div className="flex items-center">
        <div onClick={() => setNav(!nav)} className="cursor-pointer">
          <AiOutlineMenu size={30} />
        </div>
        <Link to="/">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">
            E <span className="font-bold text-red-700">Computers</span>
          </h1>
        </Link>
      </div>
      {/* search bar */}
      <div className="flex flex-col items-center" ref={searchRef}>
        <div className="bg-gray-200 rounded-full items-center flex px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
          <AiOutlineSearch size={30} />
          <input
            type="text"
            placeholder="Search Products"
            className="bg-transparent p-2 w-full focus:outline-none"
            onFocus={() => setSearchFocus(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="absolute w-[480px] z-20 mt-10">
          {debouncedSearch.length > 1 && searchFocus && (
            <div className="bg-white shadow-lg">
              {searchProducts?.length > 0 ? (
                searchProducts.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-200"
                    onClick={() => {
                      setTimeout(() => {
                        setSearchFocus(false);
                      }, 100);
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-10 w-10 object-contain"
                    />
                    <p>{product.productName}</p>
                  </Link>
                ))
              ) : (
                <p className="p-2">No products found</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* cart button */}

      <div className=" flex gap-5">
        <Link to="/cart">
          <button className="bg-black text-white rounded-full boder border-black  px-5  md:flex hidden py-2 hover:scale-105 duration-300">
            <BsFillCartFill size={20} className="mr-2" />{" "}
            <p className="text-yellow-300 font-bold capitalize">
              cart({cart?.length || 0})
            </p>
          </button>
        </Link>

        <div className="flex items-center gap-2 p-1 px-4 text-blue-500 hover:cursor-pointer border rounded-lg hover:scale-105 duration-300">
          <FaUserCircle size={20} />
          <Link
            to="/user/profile"
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <h1 className="font-semibold">{user ? user?.username : "user"}</h1>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="p-2  flex gap-2 text-blue-600  hover:rounded-lg border hover:scale-105 duration-300 border-white shadow-sm bg-red-700 rounded-lg cursor-pointer items-center"
        >
          <RiLogoutBoxLine size={20} className="text-white" />
        </button>
      </div>

      {/* Mobile menu */}
     

      {/* side drawer menu */}
      
    </div>
  );
};

export default NavBar;
