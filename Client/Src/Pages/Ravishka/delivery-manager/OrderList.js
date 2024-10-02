import { useEffect, useMemo, useState } from "react";
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
import { IoSearch } from "react-icons/io5";
import jsPDF from "jspdf";
import axios from "axios";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import OrderDetailsModal from "./OrderDetailsModal";
import DeleteOrder from "./DeleteOrder";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [clickOrder, setClickOrder] = useState(null);
  const [clickOrderId, setClickOrderId] = useState(null);

  const { isOpen: isOpenMoreDetails, onOpenChange: onOpenChangeMoreDetails } =
    useDisclosure();
  const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
    useDisclosure();

  console.log(orders);
  const rowsPerPage = 3;
  const pages = Math.ceil(orders.length / rowsPerPage);

  const filterSales = useMemo(() => {
    return orders.filter((item) =>
      item.orderItems[0].name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, orders]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filterSales?.slice(start, end);
  }, [page, filterSales]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`http://localhost:5000/orders`);
        const data = await res.json();
        // const orderSuccess = data.filter((i) => i.orderStatus === "Success");
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSales();
  }, [refetch]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Sales Report", 14, 10);

    const tableColumn = [
      "Id",
      "Order Item",
      "Shipping Address",
      "Payment Method",
      "Total Price",
      "Order Status",
    ];

    const tableRows = [];

    orders.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.orderItems.map((p) => p.name).join(", "),
        item.shippingAddress.address,
        item.paymentMethod,
        `LKR ${item.totalPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        item.orderStatus,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("orders-report.pdf");
  };

  const handelChange = async (e, id) => {
    const res = await axios.put(`http://localhost:5000/orders/${id}`, {
      orderStatus: e.target.value,
    });

    if (res.status === 200) {
      setRefetch(!refetch);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full ">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {" "}
      <div className="w-full items-center justify-center flex flex-col">
        <div className="flex justify-between p-2">
          <h1 className="text-center mt-2 font-semibold text-lg">Order List</h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search orders..."
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
              <TableColumn>Order Item</TableColumn>
              <TableColumn>User name</TableColumn>
              <TableColumn>Shipping Address</TableColumn>
              <TableColumn>Payment Method</TableColumn>
              <TableColumn>Total Price</TableColumn>
              <TableColumn>Order Status</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map(
                (item, index) => (
                  //   item.orderStatus === "Success" && (
                  <TableRow key={item._id} className="border-b-1">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.orderItems.map((p) => {
                        return (
                          <div className="flex gap-2">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10"
                            />
                            <span>{p.name}</span>
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell>{item?.user?.username}</TableCell>
                    <TableCell>{item.shippingAddress.address}</TableCell>
                    <TableCell>{item.paymentMethod}</TableCell>
                    <TableCell>
                      LKR:{" "}
                      {item.totalPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <select
                        className={
                          item.orderStatus === "Pending"
                            ? "bg-yellow-500 p-1 rounded-md text-white ring-0"
                            : item.orderStatus === "Delivered"
                            ? "bg-green-500 p-1 rounded-md text-white ring-0"
                            : "bg-red-500 p-1 rounded-md text-white ring-0"
                        }
                        value={item.orderStatus}
                        onChange={(e) => handelChange(e, item._id)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </TableCell>
                    <TableCell className="flex gap-6 justify-center items-center h-16">
                      <Tooltip color="danger" content="Delete supplier">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteSweep
                            onClick={() => {
                              setClickOrderId(item._id);
                              onOpenChangeDelete();
                            }}
                          />
                        </span>
                      </Tooltip>{" "}
                      <Tooltip color="secondary" content="More details">
                        <span className="text-lg text-blue-700 cursor-pointer active:opacity-50">
                          <FaRegEye
                            onClick={() => {
                              setClickOrder(item);
                              onOpenChangeMoreDetails();
                            }}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
                //   )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <OrderDetailsModal
        isOpen={isOpenMoreDetails}
        onOpenChange={onOpenChangeMoreDetails}
        clickOrder={clickOrder}
      />
      <DeleteOrder
        isOpen={isOpenDelete}
        onOpenChange={onOpenChangeDelete}
        orderId={clickOrderId}
        setOrders={setOrders}
        setClickOrderId={setClickOrderId}
      />
    </Layout>
  );
};
export default OrderList;
