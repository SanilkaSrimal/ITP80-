import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteOrder = ({
  isOpen,
  onOpenChange,
  orderId,
  setOrders,
  setClickOrderId,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Order</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this order</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                disabled={!orderId}
                onClick={async () => {
                  if (orderId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/orders/${orderId}`
                      );
                      setOrders((prevOrder) =>
                        prevOrder.filter((item) => item._id !== orderId)
                      );
                      setClickOrderId(null);
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  onClose();
                }}
              >
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default DeleteOrder;
