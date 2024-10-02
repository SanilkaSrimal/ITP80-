
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
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Layout from "../../../layout/Layout";
import axios from "axios";

const DashboardServiceList = () => {
  const [page, setPage] = useState(1);
  const [service, setService] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [refetch, setRefetch] = useState(false);



  const rowsPerPage = 6;
  const pages = Math.ceil(service.length / rowsPerPage);

  const filteredCoupon = useMemo(() => {
    return service.filter((item) =>
      item.productID.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, service]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredCoupon?.slice(start, end);
  }, [page, filteredCoupon]);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await fetch(`http://localhost:5000/service`);
        const data = await res.json();

        setService(data);
        setLoading(false);
        setRefetch(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoupon();
  }, [refetch]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User service Report", 14, 10);

    const tableColumn = [
      "#",
      "Product ID",
      "Product Name",
      "User Email",
      " Purchased Date",
      " Warranty Period",
      "Claim Description",
      "Claim Status",
    ];
    const tableRows = [];

    service.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.productID,
        item.productName,
        item.user.email,
        item.productPurchasedDate,
        item.productWarrantyPeriod,
        item.claimDescription,
        item.status,
      ];

      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("service-report.pdf");
  };
  const handelChange = async (e, id) => {
    const res = await axios.put(`http://localhost:5000/service/${id}`, {
      status: e.target.value,
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
        <div className="">
          <h1 className="mt-2 font-semibold text-lg text-center">
            User Services
          </h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search your service..."
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
              <TableColumn>Product ID</TableColumn>
              <TableColumn>Product Name</TableColumn>

              <TableColumn>User Email</TableColumn>
              <TableColumn> Purchased Date</TableColumn>
              <TableColumn> Warranty Period</TableColumn>
              <TableColumn>Claim Description</TableColumn>
              <TableColumn>Claim Status</TableColumn>
              {/* <TableColumn>Action</TableColumn> */}
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const date = new Date(item.productPurchasedDate);

                const formattedDate = isNaN(date.getTime())
                  ? "Invalid date"
                  : date.toLocaleDateString("en-US");

                return (
                  <TableRow key={item._id}>
                    <TableCell>{item.productID}</TableCell>
                    <TableCell>{item.productName}</TableCell>

                    <TableCell>{item?.user?.email}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{item.productWarrantyPeriod}</TableCell>
                    <TableCell>{item.claimDescription}</TableCell>
                    <TableCell>
                      <select
                        className={
                          item.status === "Pending"
                            ? "bg-red-500 p-1 rounded-md text-white ring-0"
                            : item.status === "Confirm"
                            ? "bg-green-500 p-1 rounded-md text-white ring-0"
                            : "bg-yellow-500 p-1 rounded-md text-white ring-0"
                        }
                        value={item.status}
                        onChange={(e) => handelChange(e, item._id)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirm">Confirm</option>
                        <option value="Progress">Progress</option>
                      </select>
                    </TableCell>
                    {/* <TableCell className="flex gap-6">
                      <Tooltip color="danger" content="cancel">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteSweep
                            onClick={() => {
                              setServiceId(item._id);
                              onOpenChange();
                            }}
                          />
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
      {/* <DeleteUserService
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        serviceId={serviceId}
        setServiceId={setServiceId}
        setRefetch={setRefetch}
        setService={setService}
      /> */}
    </Layout>
  );
};
export default DashboardServiceList;
