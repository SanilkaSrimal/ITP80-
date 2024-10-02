import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RequestToSupplierModel = ({
  isOpen,
  onOpenChange,
  supplierId,
  setSupplier,
  setSupplierId,
  setRefetch,
  supplier,
}) => {
  const [Quantity, setQuantity] = useState(0);
  const [Message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (Quantity === 0) {
      toast.error("Please enter quantity");
      return;
    }

    if (Message === "") {
      toast.error("Please enter message");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/supply-request", {
        supplierName: supplier.supplierName,
        email: supplier.email,
        supplyProduct: supplier.supplyProduct,
        quantity: Quantity,
        message: Message,
      });

      if (res.status === 201) {
        toast.success("Request sent successfully");
        navigate("/dashboard/supply/request-list");
        onOpenChange();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Request Supplier</h4>
            </ModalHeader>
            <ModalBody>
              <p>Request to supplier to add new items to the inventory</p>

              <div className="flex flex-col gap-2 mt-4">
                <form className="flex  flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Supplier Name"
                      label="Supplier Name"
                      value={supplier.supplierName}
                      disabled
                    />
                    <Input
                      placeholder="Supplier Email"
                      label="Supplier Email"
                      value={supplier.email}
                      disabled
                    />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Supply Product"
                      label="Supply Product"
                      value={supplier.supplyProduct}
                      disabled
                    />

                    <Input
                      placeholder="Product Quantity"
                      label="Product Quantity"
                      type="number"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Message"
                      label="Message"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Request
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default RequestToSupplierModel;
