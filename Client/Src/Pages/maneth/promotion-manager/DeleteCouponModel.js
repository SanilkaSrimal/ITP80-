import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteCouponModel = ({
  isOpen,
  onOpenChange,
  couponId,
  setCoupon,
  setCouponId,
  setRefetch,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Coupon</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this coupon</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                disabled={!couponId}
                onClick={async () => {
                  if (couponId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/coupon/${couponId}`
                      );
                      setCoupon((prevCoupon) =>
                        prevCoupon.filter((item) => item._id !== couponId)
                      );
                      setCouponId(null);
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
export default DeleteCouponModel;
