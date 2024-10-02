import { MdDeleteSweep } from "react-icons/md";

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
import { Link } from "react-router-dom";
import "jspdf-autotable";
import UserDash from "../../UserDash";
import DeleteUserService from "./DeleteUserService";

const UserServicesList = () => {
  const [page, setPage] = useState(1);
  const [service, setService] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceId, setServiceId] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [user, setUser] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));

    if (user) {
      setUser(user);
    }
  }, []);

  const rowsPerPage = 6;
  const pages = Math.ceil(service.length / rowsPerPage);

  const filteredCoupon = useMemo(() => {
    return service.filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase())
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
        const res = await fetch(
          `http://localhost:5000/service/get-user-service/${user._id}`
        );
        const data = await res.json();

        setService(data);
        setLoading(false);
        setRefetch(!refetch);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoupon();
  }, [user]);
  //   const generatePDF = () => {
  //     const doc = new jsPDF();
  //     doc.text("Coupon List Report", 14, 10);

  //     const tableColumn = ["ID", "Coupon Code", "discount", "expiry Date"];
  //     const tableRows = [];

  //     service.forEach((item, index) => {
  //       const rowData = [
  //         index + 1,
  //         item.serviceCode,
  //         item.discount,
  //         item.expiryDate,
  //       ];

  //       tableRows.push(rowData);
  //     });

  //     doc.autoTable({
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 20,
  //     });

  //     doc.save("service-list-report.pdf");
  //   };

  if (loading) {
    return (
      <UserDash>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </UserDash>
    );
  }

  return (
    <UserDash>
      <div className="w-full items-center justify-center flex flex-col">
        <div className="flex w-[1000px] justify-between">
          <h1 className="mt-2 font-semibold text-lg">Your Services</h1>
          <Link
            to="/user/service"
            className="mt-5 px-10 w-[200px] h-[40px] bg-blue-500 rounded-xl text-white justify-center items-center flex text-sm"
            color="primary"
          >
            Add New Service
          </Link>
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
          {/* <button
            className="bg-blue-500 text-white px-4 text-sm rounded-lg"
            // onClick={generatePDF}
          >
            Download PDF
          </button> */}
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
              <TableColumn>Product Purchased Date</TableColumn>
              <TableColumn>Product Warranty Period</TableColumn>
              <TableColumn>Claim Description</TableColumn>
              <TableColumn>Claim Status</TableColumn>
              <TableColumn>Action</TableColumn>
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
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{item.productWarrantyPeriod}</TableCell>
                    <TableCell>{item.claimDescription}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell className="flex gap-6">
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteUserService
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        serviceId={serviceId}
        setServiceId={setServiceId}
        setRefetch={setRefetch}
        setService={setService}
      />
    </UserDash>
  );
};
export default UserServicesList;
