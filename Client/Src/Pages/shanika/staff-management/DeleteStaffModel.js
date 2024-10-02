import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteStaffModel = ({
  isOpen,
  onOpenChange,
  staffId,
  setStaff,
  setStaffId,
  setRefetch,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Staff</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this staff member?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!staffId}
                onClick={async () => {
                  if (staffId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/auth/${staffId}`
                      );
                      setStaff((prevStaff) =>
                        prevStaff.filter((item) => item._id !== staffId)
                      );
                      setStaffId(null);
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default DeleteStaffModel;
