


// import React, { useContext, useState } from "react";
// import "./PlaceOrder.css";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const PlaceOrder = () => {
//   const {
//     getTotalCartAmount,
//     getFinalAmount,
//     discountAmount,
//     applyCoupon,
//     token,
//     food_list,
//     cartItems,
//     url,
//   } = useContext(StoreContext);

//   const [couponCode, setCouponCode] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔥 Apply Coupon with Toast
//   const handleApplyCoupon = async () => {
//     if (!couponCode) {
//       toast.error("Enter coupon code");
//       return;
//     }

//     try {
//       const res = await applyCoupon(couponCode);

//       if (res.success) {
//         toast.success("Coupon Applied Successfully 🎉");
//       } else {
//         toast.error(res.message || "Invalid coupon");
//       }
//     } catch (error) {
//       toast.error("Failed to apply coupon");
//     }
//   };

//   // 🔥 Place Order with Loading + Toast
//   const placeorder = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);

//     let orderItems = [];

//     food_list.forEach((item) => {
//       if (cartItems[item._id] > 0) {
//         orderItems.push({
//           _id: item._id,
//           name: item.name,
//           price: item.price,
//           quantity: cartItems[item._id],
//         });
//       }
//     });

//     const orderData = {
//       items: orderItems,
//       couponCode: couponCode || null,
//     };

//     try {
//       const response = await axios.post(
//         url + "/api/order/place",
//         orderData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success && response.data.session_url) {
//         toast.loading("Redirecting to secure payment...");
//         window.location.replace(response.data.session_url);
//       } else {
//         toast.error(response.data.message || "Order failed");
//       }
//     } catch (err) {
//       console.error("Order failed:", err.response?.data || err.message);
//       toast.error("Failed to place order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="cart-total">
//       <h2>Order Summary</h2>

//       <div className="cart-total-details">
//         <p>Subtotal</p>
//         <p>₹{getTotalCartAmount()}</p>
//       </div>

//       <div className="cart-total-details">
//         <p>Service Fee</p>
//         <p>₹1</p>
//       </div>

//       <div className="coupon-box">
//         <input
//           type="text"
//           placeholder="Enter coupon code"
//           value={couponCode}
//           onChange={(e) => setCouponCode(e.target.value)}
//         />
//         <button type="button" onClick={handleApplyCoupon}>
//           Apply
//         </button>
//       </div>

//       {discountAmount > 0 && (
//         <div className="cart-total-details discount">
//           <p>Discount</p>
//           <p>- ₹{discountAmount}</p>
//         </div>
//       )}

//       <hr />

//       <div className="cart-total-details">
//         <b>Total</b>
//         <b>₹{getFinalAmount() + 1}</b>
//       </div>

//       <button
//         className="proceed-btn"
//         onClick={placeorder}
//         disabled={loading}
//       >
//         {loading ? <span className="spinner"></span> : "Proceed to Payment"}
//       </button>
//     </div>
//   );
// };

// export default PlaceOrder;














import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    getFinalAmount,
    discountAmount,
    applyCoupon,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);

  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [loading, setLoading] = useState(false);

  // ✅ APPLY COUPON
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Enter coupon code");
      return;
    }

    try {
      const res = await applyCoupon(couponCode);

      if (res.success) toast.success("Coupon Applied 🎉");
      else toast.error(res.message || "Invalid coupon");

    } catch {
      toast.error("Coupon apply failed");
    }
  };

  // ✅ PLACE ORDER
  const placeOrder = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    let orderItems = [];

    food_list.forEach((food) => {
      if (cartItems[food._id] > 0) {
        orderItems.push({
          _id: food._id,
          name: food.name,
          price: food.price,
          quantity: cartItems[food._id],
        });
      }
    });

    try {
      const res = await axios.post(
        url + "/api/order/place",
        {
          items: orderItems,
          couponCode,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ COD FLOW
      if (paymentMethod === "COD") {
        toast.success("Order Placed Successfully (COD)");
        window.location.href = "/myorders";
        return;
      }

      // ✅ ONLINE PAYMENT FLOW
      if (res.data.session_url) {
        toast.loading("Redirecting to Payment...");
        window.location.replace(res.data.session_url);
      }

    } catch (err) {
      console.error(err);
      toast.error("Order Failed");
    }

    setLoading(false);
  };

  return (
    <div className="cart-total">
      <h2>Order Summary</h2>

      {/* Subtotal */}
      <div className="cart-total-details">
        <p>Subtotal</p>
        <p>₹{getTotalCartAmount()}</p>
      </div>

      {/* Service Fee */}
      <div className="cart-total-details">
        <p>Service Fee</p>
        <p>₹1</p>
      </div>

      {/* Coupon */}
      <div className="coupon-box">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button type="button" onClick={handleApplyCoupon}>
          Apply
        </button>
      </div>

      {/* Discount */}
      {discountAmount > 0 && (
        <div className="cart-total-details discount">
          <p>Discount</p>
          <p>- ₹{discountAmount}</p>
        </div>
      )}

      <hr />

      {/* Total */}
      <div className="cart-total-details">
        <b>Total</b>
        <b>₹{getFinalAmount() + 1}</b>
      </div>

      {/* Payment Method */}
      <div className="payment-method-box">
        <h3>Select Payment Method</h3>

        <label>
          <input
            type="radio"
            checked={paymentMethod === "ONLINE"}
            onChange={() => setPaymentMethod("ONLINE")}
          />
          Online Payment
        </label>

        <label>
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash On Delivery
        </label>
      </div>

      {/* Button */}
      <button
        className="proceed-btn"
        onClick={placeOrder}
        disabled={loading}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default PlaceOrder;
