import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";

const PromotionModal = ({
  isOpen,
  onOpenChange,
  setRefetch,
  selectedProduct,
}) => {
  const [discount, setDiscount] = useState(0);

  const updateProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/products/${selectedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promotion: discount >= 0 ? false : true,
          discount: discount,
        }),
      });

      setTimeout(() => setRefetch(true), 300);
      onOpenChange();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Add Discount</h4>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Discount"
                placeholder="Enter discount"
                type="number"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={updateProduct}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PromotionModal;
