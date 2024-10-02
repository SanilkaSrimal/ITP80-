import Layout from "../../../layout/Layout";
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";

import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RiDiscountPercentFill } from "react-icons/ri";
import { RiDiscountPercentLine } from "react-icons/ri";
import "jspdf-autotable";
import PromotionModal from "./PromotionModal";
// import DeleteProductModel from "./DeleteProductModel";

const PromotionItems = () => {
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refetch, setRefetch] = useState(false);

  const { isOpen, onOpenChange } = useDisclosure();

  const rowsPerPage = 4;
  const pages = Math.ceil(product.length / rowsPerPage);

  const filteredStaff = useMemo(() => {
    return product.filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, product]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStaff?.slice(start, end);
  }, [page, filteredStaff]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProduct(data.products);
        setLoading(false);
        setRefetch(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, [refetch]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full items-center justify-center flex flex-col">
        <div className="flex justify-between p-2">
          <h1 className="text-center mt-2 font-semibold text-lg">
            Promotion Items
          </h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search product..."
              startContent={<IoSearch />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="min-w-[1000px] mt-2">
          <Table
            aria-label="Example table with pagination"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>Id</TableColumn>
              <TableColumn>Product Name</TableColumn>
              <TableColumn>Product Image</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Discount</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn className="">promotion</TableColumn>
              {/* <TableColumn>coupon</TableColumn> */}
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                return (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover"
                      />
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.discount}%</TableCell>

                    <TableCell>{item.price}</TableCell>
                    <TableCell className="flex items-center h-20 ml-5">
                      {item.discount > 0 ? (
                        <Tooltip color="danger" content=" promotion ">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <RiDiscountPercentFill
                              onClick={() => {
                                onOpenChange();
                                setSelectedProduct(item);
                              }}
                            />
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip color="danger" content=" promotion ">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <RiDiscountPercentLine
                              onClick={() => {
                                onOpenChange();
                                setSelectedProduct(item);
                              }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                    {/* <TableCell className="items-center h-20 justify-center ml-5">
                      <Tooltip color="danger" content="Add Coupon">
                        <span className="text-lg  cursor-pointer active:opacity-50 text-blue-800">
                          <IoIosAddCircle />
                        </span>
                      </Tooltip>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <PromotionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setRefetch={setRefetch}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </Layout>
  );
};
export default PromotionItems;
