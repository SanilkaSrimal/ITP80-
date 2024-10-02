import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteUserService = ({
  isOpen,
  onOpenChange,
  serviceId,
  setService,
  setServiceId,
  setRefetch,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Your Service</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                disabled={!serviceId}
                onClick={async () => {
                  if (serviceId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/service/${serviceId}`
                      );
                      setService((prevCoupon) =>
                        prevCoupon.filter((item) => item._id !== serviceId)
                      );
                      setServiceId(null);
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
export default DeleteUserService;
