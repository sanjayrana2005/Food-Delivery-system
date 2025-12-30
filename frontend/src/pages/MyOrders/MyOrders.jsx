import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { url, currency } = useContext(StoreContext);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || url;

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/order/userorders`, {
        withCredentials: true
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="container">
          {orders.map((order, index) => (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="Parcel" />
              <p>
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} x {item.quantity}{i < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p>Total: {currency}{order.amount}</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span style={{ color: order.payment ? 'green' : 'red' }}>&#x25cf;</span>{' '}
                <b>{order.status || (order.payment ? 'Paid' : 'Pending')}</b>
              </p>
              {/* Optional: track order button */}
              <button onClick={fetchOrders}>Refresh Orders</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
