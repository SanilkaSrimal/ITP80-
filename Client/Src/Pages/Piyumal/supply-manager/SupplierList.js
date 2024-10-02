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
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DeleteSupplierModel from "./DeleteSupplierModel";
import { MdAddBusiness } from "react-icons/md";
import RequestToSupplierModel from "./RequestToSupplierModel";

const SupplierList = () => {
  const [page, setPage] = useState(1);
  const [supplier, setSupplier] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [supplierId, setSupplierId] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [supplierValue, setSupplierValue] = useState(null);

  const { isOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
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
        const res = await fetch("http://localhost:5000/supplies");
        const data = await res.json();

        setSupplier(data.supplier);
        setLoading(false);
        setRefetch(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSupplier();
  }, [refetch]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Supplier List Report", 14, 10);

    const tableColumn = [
      "ID",
      "supplier Name",
      "Email",
      "company Name",
      "Phone Number",
      "Address",
      "Supply Products",
    ];
    const tableRows = [];

    items.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.supplierName,
        item.email,
        item.companyName,
        item.phoneNumber,
        item.address,
        item.supplyProduct,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("supplier-list-report.pdf");
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
            Supplier List
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
              <TableColumn>Supplier Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Company Name</TableColumn>
              <TableColumn>Phone Number</TableColumn>
              <TableColumn>Supply Product</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>{item.phoneNumber}</TableCell>
                  <TableCell>{item.supplyProduct}</TableCell>
                  <TableCell className="flex gap-6">
                    <Tooltip content="Edit supplier">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <FaUserEdit
                          onClick={() =>
                            navigate(`/dashboard/supply/edit/${item._id}`)
                          }
                        />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete supplier">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        <MdDeleteSweep
                          onClick={() => {
                            setSupplierId(item._id);
                            onOpenChange();
                          }}
                        />
                      </span>
                    </Tooltip>{" "}
                    <Tooltip color="secondary" content="request to supplier">
                      <span className="text-lg text-blue-700 cursor-pointer active:opacity-50">
                        <MdAddBusiness
                          onClick={() => {
                            setSupplierValue(item);
                            onOpenChange();
                          }}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteSupplierModel
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        supplierId={supplierId}
        setSupplierId={setSupplierId}
        setRefetch={setRefetch}
        setSupplier={setSupplier}
      />
      <RequestToSupplierModel
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        supplierId={supplierId}
        setSupplierId={setSupplierId}
        setRefetch={setRefetch}
        setSupplier={setSupplier}
        supplier={supplierValue}
      />
    </Layout>
  );
};
export default SupplierList;
