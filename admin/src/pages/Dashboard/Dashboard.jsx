








import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  // 📦 Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);

      if (response.data.success) {
        const data = response.data.data;
        setOrders(data);
        calculateStats(data);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  // 📊 Calculate dashboard statistics (ignore cancelled orders)
  const calculateStats = (ordersData) => {
    let ordersCount = 0;
    let revenue = 0;
    let products = 0;

    ordersData.forEach((order) => {
      if (order.status === "Cancelled") return; // ❌ Ignore cancelled

      ordersCount += 1;
      revenue += order.amount;

      order.items.forEach((item) => {
        products += item.quantity;
      });
    });

    setTotalOrders(ordersCount);
    setTotalRevenue(revenue);
    setTotalProducts(products);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ❌ Filter cancelled orders from recent orders
  const activeOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* 📊 Stats Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <p className="card-title">Total Orders</p>
          <h2>{totalOrders}</h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Total Revenue</p>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Total Products Sold</p>
          <h2>{totalProducts}</h2>
        </div>
      </div>

      {/* 📦 Recent Orders */}
      <div className="dashboard-orders">
        <h2>Recent Orders</h2>

        {activeOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          activeOrders.slice(0, 5).map((order, index) => (
            <div key={order._id || index} className="recent-order">
              <p><b>ID:</b> {order._id}</p>
              <p><b>Amount:</b> ₹{order.amount}</p>
              <p><b>Status:</b> {order.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;




















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Dashboard.css";
// import { toast } from "react-toastify";

// const Dashboard = ({ url, token }) => {
//   const [orders, setOrders] = useState([]); // always an array
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);

//   // ✅ Fetch Orders
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(`${url}/api/order/list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success && Array.isArray(res.data.orders)) {
//         const data = res.data.orders;
//         setOrders(data);
//         calculateDashboard(data);
//       } else {
//         setOrders([]); // fallback to empty array
//         toast.error("Failed to load dashboard data");
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]); // prevent undefined state
//       toast.error("Server Error");
//     }
//   };

//   // ✅ Calculate Dashboard Data
//   const calculateDashboard = (ordersData) => {
//     let ordersCount = 0;
//     let revenue = 0;
//     let products = 0;

//     ordersData.forEach((order) => {
//       // ❌ Skip Cancelled Orders
//       if (order.status === "Cancelled") return;

//       // ❌ Skip Unpaid Orders
//       if (!order.payment && !order.paymentReceived) return;

//       // ✅ Count Paid Orders
//       ordersCount += 1;
//       revenue += order.amount || 0;

//       if (Array.isArray(order.items)) {
//         order.items.forEach((item) => {
//           products += item.quantity || 0;
//         });
//       }
//     });

//     setTotalOrders(ordersCount);
//     setTotalRevenue(revenue);
//     setTotalProducts(products);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="admin-dashboard">
//       <h1 className="dashboard-title">Admin Dashboard</h1>

//       {/* 📊 Stats Cards */}
//       <div className="dashboard-cards">
//         <div className="dashboard-card">
//           <p className="card-title">Total Paid Orders</p>
//           <h2>{totalOrders}</h2>
//         </div>

//         <div className="dashboard-card">
//           <p className="card-title">Total Revenue</p>
//           <h2>₹ {totalRevenue}</h2>
//         </div>

//         <div className="dashboard-card">
//           <p className="card-title">Products Sold</p>
//           <h2>{totalProducts}</h2>
//         </div>
//       </div>

//       {/* 📦 Recent Orders */}
//       <div className="dashboard-orders">
//         <h2>Recent Orders</h2>

//         {Array.isArray(orders) && orders.length === 0 ? (
//           <p>No orders found</p>
//         ) : (
//           <table className="dashboard-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Payment</th>
//                 <th>Method</th>
//               </tr>
//             </thead>

//             <tbody>
//               {Array.isArray(orders) &&
//                 orders.slice(0, 5).map((order) => (
//                   <tr key={order._id}>
//                     <td>{order._id ? order._id.slice(-6) : "N/A"}</td>
//                     <td>₹ {order.amount || 0}</td>
//                     <td>{order.status || "Unknown"}</td>
//                     <td>
//                       {order.payment || order.paymentReceived ? "Paid" : "Pending"}
//                     </td>
//                     <td>{order.paymentMethod || "N/A"}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

