import { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import { createPortal } from 'react-dom';
import "./OrdersDisplay.css";
import { useNavigate } from "@tanstack/react-router";
import Select from 'react-select';
import OrdersDisplayPopUp from '../OrdersDisplayPopUp/OrdersDisplayPopUp';

const calculatePrice = function(order){
  let sum_price = 0;
  const order_lines = order.order_lines;
  for (const order_line in order_lines) {
    const product_price = Number(order_lines[order_line].product_price);
    const product_quantity = Number(order_lines[order_line].quantity);
    const totalPrice = product_price*product_quantity
    sum_price += totalPrice;
  }
  return sum_price;
}

const StatusQueryOptions = [
  { value: 'All', label: 'All' },
  { value: 'Waiting for payment', label: 'Waiting for payment' },
  { value: 'Waiting for approval', label: 'Waiting for approval' },
  { value: 'Approved', label: 'Approved'},
  { value: 'Delivered', label: 'Delivered'},
  { value: 'Cancelled', label: 'Cancelled'}
];

const DirectionQueryOptions = [
  { value: 'desc', label: 'Latest' },
  { value: 'asc', label: 'Oldest' }
];

function OrdersTable() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedStatusQuery, setSelectedStatusQuery] = useState(StatusQueryOptions[0]);
  const [selectedTimeQuery, setSelectedTimeQuery] = useState(DirectionQueryOptions[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [PopUpData, setPopUpData] = useState([]);

  const statusValue = selectedStatusQuery.value;
  const timeValue = selectedTimeQuery.value;

  const onClickPopUp = function(data) {
    data.sum_price = calculatePrice(data);
    setPopUpData(data);
    setIsPopUpOpen(true);
  }

  const onClosePopUp = function() {
    setIsCancel(false);
    setIsPopUpOpen(false);
  }

  const onCancelPopUp = function(data) {
    setIsCancel(true);
    onClickPopUp(data);
  }
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_DOMAIN + "/api/orders/all", {
          params: {
            format: 'true',
            sort_by_time: timeValue,
            sort_by_status: statusValue,
            search: appliedSearchTerm.trim() || undefined,
          },
          withCredentials: true
        });
        
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        
        setOrders(response.data);
      } catch (err) {
        navigate({ to: "/employees/" });
      }
    };

    fetchOrders();
  }, [refreshTrigger, statusValue, timeValue, appliedSearchTerm]);

  const displayedOrders = useMemo(() => {
    const normalizedSearch = appliedSearchTerm.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const matchesStatus =
          statusValue === 'All' || order.status === statusValue;

        if (!normalizedSearch) {
          return matchesStatus;
        }

        const name = (order.customer_name || '').toLowerCase();
        const customerId = String(order.customer_id || '');
        const orderId = String(order.order_id || '');

        const matchesSearch =
          name.includes(normalizedSearch) ||
          customerId.includes(normalizedSearch) ||
          orderId.includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.order_creation_date).getTime();
        const dateB = new Date(b.order_creation_date).getTime();
        return timeValue === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [orders, statusValue, appliedSearchTerm, timeValue]);

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      <div className="dropdown">
        <div className="dropdown-field">
          <span className="dropdown-label">Status</span>
          <Select
            classNamePrefix="dropdown-select"
            value={selectedStatusQuery}
            onChange={(option) => setSelectedStatusQuery(option ?? StatusQueryOptions[0])}
            options={StatusQueryOptions}
          />
        </div>
        <div className="dropdown-field">
          <span className="dropdown-label">Sort by Time</span>
          <Select
            classNamePrefix="dropdown-select"
            value={selectedTimeQuery}
            onChange={(option) => setSelectedTimeQuery(option ?? DirectionQueryOptions[0])}
            options={DirectionQueryOptions}
          />
        </div>
        <div className="dropdown-field dropdown-field-search">
          <span className="dropdown-label">Search</span>
          <div className="dropdown-search-controls">
            <input
              type="text"
              className="dropdown-input"
              placeholder="Search by customer name, customer ID, or order ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              type="button"
              className="dropdown-button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {isPopUpOpen && createPortal(<OrdersDisplayPopUp onClose={onClosePopUp} onRefresh={triggerRefresh} data={PopUpData} isCancel={isCancel}/>, document.body)}

      <div className="orders-list">
        {displayedOrders.map((order) => {
          const orderDate = new Date(order.order_creation_date).toLocaleString("en-EN", {
            dateStyle: "long",
            timeStyle: "short",
          });
          
          const orderItems = Object.values(order.order_lines);
          const payment_proof_link = import.meta.env.VITE_API_DOMAIN + "/public/uploads/" + order.payment_proof
          const itemCount = orderItems.length;
          let orderUpdateDate = null;

          if (order.status_update_date){
              orderUpdateDate = new Date(order.status_update_date).toLocaleString("en-EN", {
              dateStyle: "long",
              timeStyle: "short",
            });
          }

          return (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h2>Order #{order.order_id}</h2>
                  <h3>Customer: {order.customer_name} ({order.customer_id})</h3>
                  <p className="order-date lilgray">Created: {orderDate}</p>
                  {orderUpdateDate && (<p className="order-date lilgray">Updated: {orderUpdateDate}</p>)}
                  <p className="order-item-count">
                    {itemCount} item{itemCount > 1 ? "s" : ""}
                  </p>
                  <p className="order-shipping">
                    {order.shipping_destination}
                  </p>
                </div>

                <div className="order-status-bar">
                    <span
                    className={`order-status ${
                      order.status === "Delivered" ? "status-delivered" : "status-pending"
                    }`}
                  >
                    
                    {order.status === "Waiting for approval" ? "Waiting for approval" : order.status}
                  </span>
                  <div className="lilgray">{order.tracking_number}</div>
                </div>
              </div>

              {/* Items */}
              <div className="order-items">
                {orderItems.map((item, index) => (
                  <p key={index} className="order-item">
                    {item.quantity}x {item.p_name}{" "}
                    <span className="order-item-method">
                      ({item.order_method})
                    </span>
                  </p>
                ))}
              </div>

              {/* Footer */}
              <div className="order-footer">
                <p className="order-price">{calculatePrice(order)} Baht</p>
                

                {/* Right Side */}
                <div>
                  {(order.status !== "Cancelled" && order.status !== "Delivered" ) && (
                    <a className="cancel-order" onClick={() => onCancelPopUp(order)}>Cancel Order</a>
                  )}
                  {order.payment_proof && (
                    <a href={payment_proof_link} className="paymentProof">View payment proof</a>
                  )}
                  {order.status === "Waiting for approval" && (
                    <button
                      type="button"
                      className="resend-payment-slip-btn"
                      onClick={() => onClickPopUp(order)}>
                      Approve Order
                    </button>
                  )}
                  {order.status === "Approved" && (
                    <button 
                      type="button"
                      className="send-payment-slip-btn"
                      onClick={() => onClickPopUp(order)}>
                      Deliver Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersTable;
