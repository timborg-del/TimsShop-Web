import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Product } from "../apiService";
import { CurrencyContext } from "../components/CurrencyDetector";

type MessageProps = {
  content: string;
};

type PayPalData = {
  orderID: string;
};

type PayPalActions = {
  restart: () => void;
};

interface Address {
  address_line_1: string;
  admin_area_2: string;
  city: string | null;
  country_code: string;
  postal_code: string;
  state: string | null;
  phone: string | null;
  normalization_status: string | null;
  type: string | null;
  email_address: string | null;
  recipient_name: string | null;
}

interface Name {
  given_name: string | null;
  surname: string | null;
  full_name: string;
}

interface ShippingDetail {
  name: Name;
  address: Address;
}

interface Capture {
  id: string;
  status: string;
}

interface Payments {
  captures: Capture[];
}

interface PurchaseUnit {
  payments: Payments;
  shipping: ShippingDetail;
}

interface Payer {
  name: {
    given_name: string;
    surname: string;
  };
  email_address: string;
}

interface OrderData {
  id: string;
  status: string;
  payer: Payer;
  purchase_units: PurchaseUnit[];
  details?: {
    issue?: string;
    description?: string;
    debug_id?: string;
  }[];
}

interface PaypalStuffProps {
  cart: Product[];
}

function Message({ content }: MessageProps) {
  return <p>{content}</p>;
}

function PaypalStuff({ cart }: PaypalStuffProps) {
  const { currency } = useContext(CurrencyContext); // Get currency from context
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Fetch API base URL from environment
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || ""; // Fetch PayPal Client ID from environment

  const initialOptions = {
    clientId, // Use PayPal Client ID from environment variables
    "enable-funding": "venmo",
    currency, // Pass the currency dynamically
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  const [message, setMessage] = useState<string>("");
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
    console.log('Updated cart state in ref:', cartRef.current);
  }, [cart]);

  const createOrder = useCallback(async () => {
    const currentCart = cartRef.current;
    console.log('Creating order with cart:', currentCart);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Cart: currentCart, Currency: currency }), // Ensure currency is passed
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error creating order: ${errorText}`);
        setMessage(`Error creating order: ${errorText}`);
        return;
      }

      const orderData = await response.json();

      if (orderData.orderId) {
        console.log(`Order created successfully: ${orderData.orderId}`);
        setMessage(`Order created successfully: ${orderData.orderId}`);
        return orderData.orderId;
      } else {
        console.error(`Order creation failed: ${JSON.stringify(orderData)}`);
        setMessage(`Order creation failed: ${JSON.stringify(orderData)}`);
      }
    } catch (error) {
      console.error(`Could not initiate PayPal Checkout:`, error);
      if (error instanceof Error) {
        setMessage(`Could not initiate PayPal Checkout: ${error.message}`);
      } else {
        setMessage(`Could not initiate PayPal Checkout: ${String(error)}`);
      }
    }
  }, [currency]);

  const onApprove = useCallback(async (data: PayPalData, actions: PayPalActions) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error capturing order: ${errorText}`);
        setMessage(`Error capturing order: ${errorText}`);
        return;
      }

      const orderData = await response.json();
      console.log("Capture result", orderData);

      if (!orderData.purchase_units) {
        console.error("purchase_units is undefined", orderData);
        setMessage(`Transaction ${orderData.status}: ${orderData.id}. No purchase_units in response.`);
        return;
      }

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart();
      } else if (errorDetail) {
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for all available details`);
        console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));

        // Send order details to the delivery service via email
        await sendOrderToDeliveryService(orderData, cartRef.current);
        // Send thank you email to the customer
        await sendThankYouEmailToCustomer(orderData, cartRef.current);
      }
    } catch (error) {
      console.error("Error occurred during transaction:", error);
      if (error instanceof Error) {
        setMessage(`Sorry, your transaction could not be processed...${error.message}`);
      } else {
        setMessage(`Sorry, your transaction could not be processed...${String(error)}`);
      }
    }
  }, []);

  const sendOrderToDeliveryService = async (orderData: OrderData, cart: Product[]) => {
    const payer = orderData.payer ? {
      name: `${orderData.payer.name.given_name} ${orderData.payer.name.surname}`,
      email: orderData.payer.email_address,
    } : {
      name: "Unknown",
      email: "Unknown"
    };

    const address = orderData.purchase_units[0]?.shipping?.address;
    const recipient = orderData.purchase_units[0]?.shipping?.name?.full_name;

    const cartItems = cart.map((item: Product) => `
      <tr>
        <td>${item.Name}</td>
        <td>${item.quantity}</td>
        <td>${item.Price}</td>
        <td>${item.size ?? 'N/A'}</td>
      </tr>
    `).join("");

    const emailParams = {
      orderID: orderData.id,
      status: orderData.status,
      payer: payer.name,
      to_email: "production@dpiprinters.com", // Replace with actual delivery email
      subject: "New Delivery Address and Order Details",
      message: `
      <h1>New Order Received</h1>
      <p><strong>Order ID:</strong> ${orderData.id}</p>
      <p><strong>Status:</strong> ${orderData.status}</p>
      <p><strong>Payer Name:</strong> ${payer.name}</p>
      <h2>Shipping Details:</h2>
      <p><strong>Recipient:</strong> ${recipient}</p>
      <p><strong>Street Address:</strong> ${address?.address_line_1}</p>
      <p><strong>City:</strong> ${address?.admin_area_2}</p>
      <p><strong>State/Province:</strong> ${address?.state ?? 'N/A'}</p>
      <p><strong>Postal Code:</strong> ${address?.postal_code}</p>
      <p><strong>Country Code:</strong> ${address?.country_code}</p>
      <p><strong>Phone:</strong> ${address?.phone ?? 'N/A'}</p>
      <h2>Items Ordered:</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems}
          </tbody>
        </table>
        <p>See console for all available details</p>
      `
    };

    console.log('Email Parameters:', emailParams);

    try {
      const response = await fetch(`${API_BASE_URL}/SendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailParams),
      });

      if (response.ok) {
        console.log("Order details sent to email successfully");
      } else {
        console.error("Failed to send order details to email");
      }
    } catch (error) {
      console.error("Error sending order details to email:", error);
    }
  };

  const sendThankYouEmailToCustomer = async (orderData: OrderData, cart: Product[]) => {
    const payer = orderData.payer ? {
      name: `${orderData.payer.name.given_name} ${orderData.payer.name.surname}`,
      email: orderData.payer.email_address,
    } : {
      name: "Unknown",
      email: "Unknown"
    };

    const address = orderData.purchase_units[0]?.shipping?.address;
    const recipient = orderData.purchase_units[0]?.shipping?.name?.full_name;

    const cartItems = cart.map((item: Product) => `
      <tr>
        <td>${item.Name}</td>
        <td>${item.quantity}</td>
        <td>${item.Price}</td>
        <td>${item.size ?? 'N/A'}</td>
      </tr>
    `).join("");

    const customerEmailParams = {
      orderID: orderData.id,
      status: orderData.status,
      payer: payer.name,
      to_email: payer.email,
      subject: "Thank You for Your Purchase",
      message: `
      <h1>Thank You for Your Purchase</h1>
      <p><strong>Order ID:</strong> ${orderData.id}</p>
      <p><strong>Status:</strong> ${orderData.status}</p>
      <p>Dear ${payer.name},</p>
      <p>Thank you for your purchase. We will process your order soon.</p>
      <h2>Shipping Details:</h2>
      <p><strong>Recipient:</strong> ${recipient}</p>
      <p><strong>Street Address:</strong> ${address?.address_line_1}</p>
      <p><strong>City:</strong> ${address?.admin_area_2}</p>
      <p><strong>State/Province:</strong> ${address?.state ?? 'N/A'}</p>
      <p><strong>Postal Code:</strong> ${address?.postal_code}</p>
      <p><strong>Country Code:</strong> ${address?.country_code}</p>
      <p><strong>Phone:</strong> ${address?.phone ?? 'N/A'}</p>
      <h2>Items Ordered:</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems}
          </tbody>
        </table>
        <p>Thank you for shopping with us!</p>
      `
    };

    console.log('Customer Email Parameters:', customerEmailParams);

    try {
      const response = await fetch(`${API_BASE_URL}/SendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerEmailParams),
      });

      if (response.ok) {
        console.log("Customer thank you email sent successfully");
      } else {
        console.error("Failed to send customer thank you email");
      }
    } catch (error) {
      console.error("Error sending customer thank you email:", error);
    }
  };

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
      <Message content={message} />
    </div>
  );
}

export default PaypalStuff;