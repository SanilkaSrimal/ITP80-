import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteProductModel = ({
  isOpen,
  onOpenChange,
  productId,
  setProduct,
  setProductId,

}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Product</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this product</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                disabled={!productId}
                onClick={async () => {
                  if (productId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/products/${productId}`
                      );
                      setProduct((prevStaff) =>
                        prevStaff.filter((item) => item._id !== productId)
                      );
                      setProductId(null);
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
export default DeleteProductModel;
