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
import toast from "react-hot-toast";

const ApplyFuel = ({ isOpen, onOpenChange }) => {
  const [distance, setDistance] = useState("");
  const [cost, setCost] = useState(0);
  const [date, setDate] = useState("");
  const [distanceError, setDistanceError] = useState(""); // State to track distance validation error

  const costPerKm = 30;
  const today = new Date().toISOString().split("T")[0];

  const handleDistanceChange = (e) => {
    const distanceValue = e.target.value;
    setDistance(distanceValue);

    // Clear any existing error when the user starts typing
    if (distanceValue) {
      setDistanceError("");
      setCost(distanceValue * costPerKm);
    } else {
      setCost(0);
    }
  };

  const handleAdd = async () => {
    // Reset distance error before validation
    setDistanceError("");

    // Validate distance
    if (distance === "") {
      setDistanceError("Distance is required");
      return;
    } else if (distance < 5) {
      setDistanceError("The distance should be greater than 5 km");
      return;
    }

    // Proceed if validation passes
    try {
      const response = await fetch("http://localhost:5000/fuel-rqst", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distance: distance,
          cost: cost,
          date: date,
        }),
      });
      const data = await response.json();
      console.log(data);
      toast.success("Fuel Request Added Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add fuel request");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Add Request</h4>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Distance"
                placeholder="Enter Distance"
                type="number"
                onChange={handleDistanceChange}
              />
              {/* Display distance validation error */}
              {distanceError && (
                <p className="text-red-500 text-sm">{distanceError}</p>
              )}

              <Input
                label="Cost"
                placeholder="Cost will be calculated"
                type="number"
                value={cost} // Automatically calculated cost
                readOnly
              />

              <Input
                label="Date"
                placeholder="Enter Date"
                type="date"
                max={today}
                min={today}
                value={today}
                onChange={(e) => {
                  setDate(today);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleAdd}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ApplyFuel;


/*import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
const ApplyFuel = ({ isOpen, onOpenChange }) => {
  const [distance, setDistance] = useState("");
  const [cost, setCost] = useState(0);
  const [date, setDate] = useState("");

  const costPerKm = 30;
  const today = new Date().toISOString().split("T")[0];

  const handleDistanceChange = (e) => {
    const distanceValue = e.target.value;
    setDistance(distanceValue);

    if (distanceValue) {
      setCost(distanceValue * costPerKm);
    } else {
      setCost(0);
    }
  };

  const handleAdd = async () => {
    if (distance === "" || cost === 0) {
      toast.error("Please fill all the fields");
    } 
    else if(distance<5){
      toast.error("The distance should be greater than 5 km");
    }
    else {
      try {
        const response = await fetch("http://localhost:5000/fuel-rqst", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            distance: distance,
            cost: cost,
            date: date,
          }),
        });
        const data = await response.json();
        console.log(data);
        toast.success("Fuel Request Added Successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Add Discount</h4>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Distance"
                placeholder="Enter Distance"
                type="number"
                // onChange={(e) => {
                //   setDistance(e.target.value);
                // }}
                onChange={handleDistanceChange}
              />
              <Input
                label="Cost"
                placeholder="Cost will be calculated"
                type="number"
                value={cost} // Automatically calculated cost
                readOnly
              />

              <Input
                label="Date"
                placeholder="Enter Date"
                type="date"
                max={today}
                min={today}
                value={today}
                onChange={(e) => {
                  setDate(today);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleAdd}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ApplyFuel;*/
