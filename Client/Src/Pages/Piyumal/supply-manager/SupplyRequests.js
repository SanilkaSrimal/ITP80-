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
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import "jspdf-autotable";
import axios from "axios";
const SupplyRequests = () => {
  const [page, setPage] = useState(1);
  const [supplier, setSupplier] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [refetch, setRefetch] = useState(false);


  const rowsPerPage = 6;
  const pages = Math.ceil(supplier.length / rowsPerPage);

  const filteredSupplier = useMemo(() => {
    return supplier.filter(
      (item) =>
        item.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, supplier]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredSupplier?.slice(start, end);
  }, [page, filteredSupplier]);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch("http://localhost:5000/supply-request");
        const data = await res.json();

        setSupplier(data.suppliers);
        setLoading(false);
        setRefetch(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSupplier();
  }, [refetch]);

  const handelChange = async (e, id) => {
    const res = await axios.put(`http://localhost:5000/supply-request/${id}`, {
      status: e.target.value,
    });

    if (res.status === 200) {
      setRefetch(true);
    }
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
            Supply Request
          </h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search supplier..."
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
              <TableColumn>Supplier Name</TableColumn>
              <TableColumn>Supply Product</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Message</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{item.supplyProduct}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>
                    <select
                      className={
                        item.status === "Pending"
                          ? "bg-yellow-500 p-1 rounded-md text-white ring-0"
                          : item.status === "Approved"
                          ? "bg-green-500 p-1 rounded-md text-white ring-0"
                          : "bg-red-500 p-1 rounded-md text-white ring-0"
                      }
                      value={item.status}
                      onChange={(e) => handelChange(e, item._id)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};
export default SupplyRequests;
