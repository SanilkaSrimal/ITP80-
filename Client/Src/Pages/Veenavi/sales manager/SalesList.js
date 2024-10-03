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
  
} from "@nextui-org/react";

import { IoSearch } from "react-icons/io5";
import jsPDF from "jspdf";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalSales, setTotalSales] = useState("");

  console.log(sales);
  const rowsPerPage = 3;
  const pages = Math.ceil(sales.length / rowsPerPage);

  const filterSales = useMemo(() => {
    return sales.filter((item) =>
      item.orderItems[0].name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, sales]);

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
        setSales(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSales();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Sales Report", 14, 10);

    doc.text(
      `Total Sales: LKR ${totalSales.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      14,
      20
    );

    const tableColumn = [
      "Id",
      "Order Item",
      "Shipping Address",
      "Payment Method",
      "Total Price",
      "Order Status",
    ];

    const tableRows = [];

    sales.forEach((item, index) => {
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

    doc.save("sales-report.pdf");
  };

  const TotalSalesPrice = () => {
    let total = 0;
    sales.forEach((item) => {
      total += item.totalPrice;
    });

    return total;
  };

  useEffect(() => {
    const totalSales = TotalSalesPrice();
    setTotalSales(totalSales);
  }, [sales]);

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
          <h1 className="text-center mt-2 font-semibold text-lg">Sales</h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search sales..."
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
            </TableHeader>
            <TableBody>
              {items.map(
                (item, index) =>
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
                      <TableCell>{item.orderStatus}</TableCell>
                    </TableRow>
                //   )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-end w-full pr-32">
        <span className="text-lg font-semibold  mt-4">
          Total Sales :{" "}
          <span className="text-lg font-semibold text-blue-700">
            {totalSales.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </span>
      </div>
    </Layout>
  );
};
export default SalesList;
