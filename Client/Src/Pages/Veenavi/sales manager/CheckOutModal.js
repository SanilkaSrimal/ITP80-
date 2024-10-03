import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useGlobalReefetch } from "../../../store/Store";
import { useNavigate } from "react-router-dom";

const CheckOutModal = ({ isOpen, onOpenChange, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const { globalRefetch, setGlobalRefetch } = useGlobalReefetch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    const cart = localStorage.getItem("cart");

    if (user) {
      setUser(JSON.parse(user));
    }

    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

  // Validation Function
  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    else if (name.length < 5) newErrors.name = "Name must be more than 5 letters";
    
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email is invalid";

    if (!city) newErrors.city = "City is required";
    else if (city.length < 5) newErrors.city = "City must be more than 5 letters";
    
    if (!phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(phone)) newErrors.phone = "Phone number is invalid";
    
    if (!address) newErrors.address = "Address is required";
    else if (address.length < 10) newErrors.address = "Address must be more than 10 letters";

    if (paymentMethod === "credit-card") {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) newErrors.card = "Credit card information is incomplete";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    if (!validate()) {
      setIsSubmitting(false);
      toast.error("Please correct the errors in the form.");
      return;
    }

    const data = {
      shippingAddress: { name, email, city, phone, address },
      user,
      cart,
      totalPrice: total,
      paymentMethod,
    };

    if (paymentMethod === "credit-card") {
      if (!stripe || !elements) {
        toast.error("Stripe.js has not loaded yet.");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/orders/create-payment-intent",
          { totalPrice: data.totalPrice / 300 }
        );

        const clientSecret = response.data.clientSecret;

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {
              name: data.shippingAddress.name,
              email: data.shippingAddress.email,
            },
          },
        });

        if (paymentResult.error) {
          toast.error(paymentResult.error.message);
        } else if (paymentResult.paymentIntent.status === "succeeded") {
          await axios.post("http://localhost:5000/orders", data);
          toast.success("Payment successful, order placed!");
          localStorage.removeItem("cart");
          setGlobalRefetch(!globalRefetch);
          onOpenChange();
          navigate("/user/profile");
        }
      } catch (error) {
        toast.error("Failed to place order");
        console.error(error);
      }
    } else {
      try {
        await axios.post("http://localhost:5000/orders", data);
        toast.success("Order placed successfully");
        localStorage.removeItem("cart");
        setGlobalRefetch(!globalRefetch);
        navigate("/user/profile");
        onOpenChange();
      } catch (error) {
        toast.error("Failed to place order");
        console.error(error);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Checkout</h4>
            </ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <div className="w-full">
                    <Input
                      label="Your name"
                      placeholder="Enter your name"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                  </div>
                  <div className="w-full">
                    <Input
                      label="Your email"
                      placeholder="Enter your email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-full">
                    <Input
                      label="Your city"
                      placeholder="Enter your city"
                      type="text"
                      onChange={(e) => setCity(e.target.value)}
                      error={errors.city}
                    />
                    {errors.city && <span className="text-red-500">{errors.city}</span>}
                  </div>
                  <div className="w-full">
                    <Input
                      label="Your phone number"
                      placeholder="Enter your phone number"
                      type="number"
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.phone}
                    />
                    {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-full">
                    <Textarea
                      label="Your address"
                      placeholder="Enter your address"
                      type="text"
                      onChange={(e) => setAddress(e.target.value)}
                      error={errors.address}
                    />
                    {errors.address && <span className="text-red-500">{errors.address}</span>}
                  </div>
                </div>
                <RadioGroup
                  label="Select your payment method"
                  color="secondary"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Radio size="sm" value="cash-on-delivery">
                    Cash on delivery
                  </Radio>
                  <Radio size="sm" value="credit-card">
                    Credit card
                  </Radio>
                </RadioGroup>
                {paymentMethod === "credit-card" && (
                  <div className="bg-black p-2 rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            iconColor: "#c4f0ff",
                            color: "#fff",
                            fontWeight: "500",
                            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                            fontSize: "16px",
                            fontSmoothing: "antialiased",
                            "::placeholder": {
                              color: "#87BBFD",
                            },
                          },
                          invalid: {
                            iconColor: "#FFC7EE",
                            color: "#FFC7EE",
                          },
                        },
                      }}
                    />
                    {errors.card && <span className="text-red-500">{errors.card}</span>}
                  </div>
                )}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CheckOutModal;
/*import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useGlobalReefetch } from "../../../store/Store";
import { useNavigate } from "react-router-dom";

const CheckOutModal = ({ isOpen, onOpenChange, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const { globalRefetch, setGlobalRefetch } = useGlobalReefetch();
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("authUser");
    const cart = localStorage.getItem("cart");

    if (user) {
      setUser(JSON.parse(user));
    }

    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

  const onSubmit = async () => {
    const data = {
      shippingAddress: { name, email, city, phone, address },
      user,
      cart,
      totalPrice: total,
      paymentMethod,
    };

    if (paymentMethod === "credit-card") {
      if (!stripe || !elements) {
        toast.error("Stripe.js has not loaded yet.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/orders/create-payment-intent",
          { totalPrice: data.totalPrice / 300 }
        );

        const clientSecret = response.data.clientSecret;

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {
              name: data.shippingAddress.name,
              email: data.shippingAddress.email,
            },
          },
        });

        if (paymentResult.error) {
          toast.error(paymentResult.error.message);
        } else if (paymentResult.paymentIntent.status === "succeeded") {
          await axios.post("http://localhost:5000/orders", data);
          toast.success("Payment successful, order placed!");
          localStorage.removeItem("cart");
          setGlobalRefetch(!globalRefetch);
          onOpenChange();
          navigate("/user/profile");
        }
      } catch (error) {
        toast.error("Failed to place order");
        console.error(error);
      }
    } else {
      try {
        await axios.post("http://localhost:5000/orders", data);
        toast.success("Order placed successfully");
        localStorage.removeItem("cart");
        setGlobalRefetch(!globalRefetch);
        navigate("/user/profile");
        onOpenChange();
      } catch (error) {
        toast.error("Failed to place order");
        console.error(error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Checkout</h4>
            </ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <Input
                    label="Your name"
                    placeholder="Enter your name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Your email"
                    placeholder="Enter your email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    label="Your city"
                    placeholder="Enter your city"
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    label="Your phone number"
                    placeholder="Enter your phone number"
                    type="number"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Textarea
                    label="Your address"
                    placeholder="Enter your address"
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <RadioGroup
                  label="Select your payment method"
                  color="secondary"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {" "}
                  <Radio size="sm" value="cash-on-delivery">
                    Cash on delivery
                  </Radio>
                  <Radio size="sm" value="credit-card">
                    Credit card
                  </Radio>
                </RadioGroup>
                {paymentMethod === "credit-card" && (
                  <div className="bg-black p-2 rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            iconColor: "#c4f0ff",
                            color: "#fff",
                            fontWeight: "500",
                            boarder: "1px solid #c4f0ff",
                            fontFamily:
                              "Roboto, Open Sans, Segoe UI, sans-serif",
                            fontSize: "16px",
                            fontSmoothing: "antialiased",
                            ":-webkit-autofill": {
                              color: "#fce883",
                            },
                            "::placeholder": {
                              color: "#87BBFD",
                            },
                          },
                          invalid: {
                            iconColor: "#FFC7EE",
                            color: "#FFC7EE",
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={onSubmit}>
                Proceed to Checkout
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CheckOutModal;*/
