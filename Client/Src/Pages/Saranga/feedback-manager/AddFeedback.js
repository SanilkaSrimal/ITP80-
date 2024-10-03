import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import toast from "react-hot-toast";
const AddFeedback = ({ isOpen, onOpenChange, order }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/feedback", {
        user: order.user,
        rating,
        feedback,
        order: order,
      });

      toast.success("Feedback added successfully");
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
              <p>Add Feedback</p>
            </ModalHeader>
            <ModalBody>
              <div>
                <div className="flex items-center gap-5 ml-2 mb-2">
                  <p>Rate the order</p>{" "}
                  <ReactStars
                    size={30}
                    onChange={(newRating) => setRating(newRating)}
                  />
                </div>
                <Textarea
                  placeholder="Enter your feedback here"
                  rows={4}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Add Feedback
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default AddFeedback;
