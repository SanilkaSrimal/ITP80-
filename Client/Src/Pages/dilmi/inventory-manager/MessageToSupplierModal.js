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

const MessageToSupplier = ({ isOpen, onOpenChange, clickedProductName }) => {
  const [message, setMessage] = useState("");

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Message </h4>
            </ModalHeader>
            <ModalBody>
              <p className="text-[12px] ml-2">
                Message to supply manager product
                <span className="ml-1 font-semibold mr-1">
                  {clickedProductName}
                </span>
              </p>
              <Textarea
                placeholder="Message to supply manager"
                onChange={(e) => setMessage(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onClick={async () => {
                  if (message.length > 10) {
                    try {
                      await axios.post("http://localhost:5000/message", {
                        message,
                        to: "suppliers",
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  } else {
                    alert("Message should be more than 10 characters");
                  }
                  onClose();
                }}
              >
                Send
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default MessageToSupplier;
