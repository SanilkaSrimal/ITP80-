import {
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
import { FcFeedback } from "react-icons/fc";
import AddFeedback from "../../Saranga/feedback-manager/AddFeedback";
const UserOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const { isOpen, onOpenChange } = useDisclosure();

  const rowsPerPage = 3;
  const pages = Math.ceil(orders.length / rowsPerPage);

  useEffect(() => {
    const user = localStorage.getItem("authUser");

    setUser(JSON.parse(user));
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders?.slice(start, end);
  }, [page, orders]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/orders/get-user-orders/${user._id}`
        );
        const data = await res.json();

        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserOrders();
  }, [user]);
  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center h-full mt-[100px]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="min-w-[1000px] mt-10">
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
              <TableColumn>Shipping Address</TableColumn>
              <TableColumn>Payment Method</TableColumn>
              <TableColumn>Total Price</TableColumn>
              <TableColumn>Order Status</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
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
                  <TableCell>
                    {item.orderStatus === "Delivered" ? (
                      <Tooltip content="Add Feedback" color="primary">
                        <span className="text-lg text-blue-900">
                          <FcFeedback
                            className="cursor-pointer "
                            size={20}
                            onClick={() => {
                              setOrder(item);
                              onOpenChange();
                            }}
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        content="order is pending can't add feedback"
                        color="danger"
                      >
                        <span className="text-lg text-red-900">
                          <FcFeedback
                            size={20}
                            className="cursor-not-allowed "
                          />
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AddFeedback isOpen={isOpen} onOpenChange={onOpenChange} order={order} />
    </div>
  );
};
export default UserOrders;
