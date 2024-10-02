import { MdDeleteSweep } from "react-icons/md";
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
import { FaUserEdit } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DeleteProductModel from "./DeleteProductModel";
import MessageToSupplierModal from "./MessageToSupplierModal";

const ProductsList = () => {
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [clickedProductName, setClickedProductName] = useState("");
  const { isOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenMessage, onOpenChange: onOpenChangeMessage } =
    useDisclosure();

  const navigate = useNavigate();
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 10);

    const tableColumn = ["Id", "Product Name", "Category", "Quantity", "Price"];

    const tableRows = [];

    product.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.productName,
        item.category,
        item.quantity,
        item.price,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("product-list-report.pdf");
  };

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
            Product List
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
          <button
            className="bg-blue-500 text-white px-4 text-sm rounded-lg"
            onClick={generatePDF}
          >
            Download PDF
          </button>
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
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Action</TableColumn>
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
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="flex gap-6  items-center h-16">
                      <Tooltip content="Edit product" className="">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <FaUserEdit
                            onClick={() =>
                              navigate(`/dashboard/products/edit/${item._id}`)
                            }
                          />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete product">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteSweep
                            onClick={() => {
                              setProductId(item._id);
                              onOpenChange();
                            }}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip color="success" content="Notify Supplier">
                        <span className="text-lg  cursor-pointer active:opacity-50 text-green-500">
                          <BiMessageRoundedDetail
                            onClick={() => {
                              setClickedProductName(item.productName);
                              onOpenChangeMessage();
                            }}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteProductModel
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        productId={productId}
        setProductId={setProductId}
        setRefetch={setRefetch}
        setProduct={setProduct}
      />
      <MessageToSupplierModal
        isOpen={isOpenMessage}
        onOpenChange={onOpenChangeMessage}
        setRefetch={setRefetch}
        clickedProductName={clickedProductName}
      />
    </Layout>
  );
};
export default ProductsList;
