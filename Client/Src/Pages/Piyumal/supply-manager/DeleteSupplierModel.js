import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteSupplierModel = ({
  isOpen,
  onOpenChange,
  supplierId,
  setSupplier,
  setSupplierId,
  setRefetch,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Supplier</h4>
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
                disabled={!supplierId}
                onClick={async () => {
                  if (supplierId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/supplies/${supplierId}`
                      );
                      setSupplier((prevStaff) =>
                        prevStaff.filter((item) => item._id !== supplierId)
                      );
                      setSupplierId(null);
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
export default DeleteSupplierModel;
