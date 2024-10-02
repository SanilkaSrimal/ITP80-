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
import ReactStars from "react-rating-stars-component";
import { MdDeleteSweep } from "react-icons/md";
import DeleteFeedback from "./DeleteFeedback";

const UserFeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clickFeedbackId, setClickFeedbackId] = useState(null);

  const rowsPerPage = 3;
  const pages = Math.ceil(feedbacks.length / rowsPerPage);

  const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
    useDisclosure();

  const filterSales = useMemo(() => {
    return feedbacks.filter((item) =>
      item?.order?.orderItems[0].name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, feedbacks]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filterSales?.slice(start, end);
  }, [page, filterSales]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`http://localhost:5000/feedback`);
        const data = await res.json();
        // const orderSuccess = data.filter((i) => i.orderStatus === "Success");
        setFeedbacks(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSales();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.text("Feedback Report", 14, 10);
  
    const tableColumn = [
      "Id",
      "Username",
      "Order Item",
      "Shipping City",
      "Payment Method",
      "Total Price",
      "Rating",
      "Feedback",
    ];
  
    const tableRows = [];
  
    feedbacks.forEach((item, index) => {
     
      const orderItems = item?.order?.orderItems?.map((p) => p.name).join(", ") || "No order items available";
      const rowData = [
        index + 1,
        item?.user?.username || "No username",         
        orderItems,                                    
        item?.order?.shippingAddress?.city || "No shipping city",  
        item?.order?.paymentMethod || "No payment method",         
        `LKR ${(item?.order?.totalPrice || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,                                           
        item?.rating || "No rating",                   
        item?.feedback || "No feedback",               
      ];
  
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
  
    doc.save("feedbacks-report.pdf");
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
          <h1 className="text-center mt-2 font-semibold text-lg">
            User Feedbacks
          </h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search feedbacks..."
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
              <TableColumn>Order</TableColumn>
              <TableColumn>Username</TableColumn>
              <TableColumn>Rating</TableColumn>
              <TableColumn>Feedback</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map(
                (item, index) => (
                  //   item.orderStatus === "Success" && (
                  <TableRow key={item._id} className="border-b-1">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item?.order?.orderItems &&
                      item?.order?.orderItems.length > 0 ? (
                        item?.order?.orderItems.map((p) => (
                          <div className="flex gap-2" key={p._id}>
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10"
                            />
                            <span>{p.name}</span>
                          </div>
                        ))
                      ) : (
                        <span>No order items available</span>
                      )}
                    </TableCell>

                    <TableCell>{item?.user?.username}</TableCell>
                    <TableCell>
                      <ReactStars size={30} edit={false} value={item?.rating} />
                    </TableCell>
                    <TableCell>{item?.feedback}</TableCell>
                    <TableCell>
                      {" "}
                      <Tooltip color="danger" content="Delete feedback">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteSweep
                            onClick={() => {
                              setClickFeedbackId(item._id);
                              onOpenChangeDelete();
                            }}
                          />
                        </span>
                      </Tooltip>{" "}
                    </TableCell>
                  </TableRow>
                )
                //   )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteFeedback
        isOpen={isOpenDelete}
        onOpenChange={onOpenChangeDelete}
        feedbackId={clickFeedbackId}
        setFeedbacks={setFeedbacks}
        setClickFeedbackId={setClickFeedbackId}
      />
    </Layout>
  );
};
export default UserFeedBacks;
