import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteFeedback = ({
  isOpen,
  onOpenChange,
  feedbackId,
  setFeedbacks,
  setClickFeedbackId,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Feedback</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this feedback</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                disabled={!feedbackId}
                onClick={async () => {
                  if (feedbackId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/feedback/${feedbackId}`
                      );
                      setFeedbacks((prevOrder) =>
                        prevOrder.filter((item) => item._id !== feedbackId)
                      );
                      setClickFeedbackId(null);
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
export default DeleteFeedback;
