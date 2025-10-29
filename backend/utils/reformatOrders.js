function reformatOrdersFunctional(originalData) {
    // Group orders by order_id using reduce
    const groupedOrders = originalData.reduce((acc, order) => {
        const orderId = order.order_id;
        if (!acc[orderId]) {
            acc[orderId] = [];
        }
        acc[orderId].push(order);
        return acc;
    }, {});
    
    // Convert grouped object to array and reformat
    return Object.entries(groupedOrders).map(([orderId, orderItems]) => {
        const firstItem = orderItems[0];
        
        const orderData = {
            order_id: orderId,
            order_creation_date: firstItem.order_creation_date,
            status: firstItem.status,
            status_update_date: firstItem.status_update_date,
            payment_proof: firstItem.payment_proof,
            shipping_destination: firstItem.shipping_destination
        };
        
        // ALWAYS use numbered keys for order_lines, even with single items
        orderData.order_lines = orderItems.reduce((lines, item, index) => {
            lines[(index + 1).toString()] = {
                order_method: item.order_method,
                product_id: item.product_id,
                p_name: item.p_name,
                quantity: item.quantity,
                product_price: item.product_price
            };
            return lines;
        }, {});
        
        return orderData;
    });
}

// Usage

const mockupData = [
    {
      "order_id": "47",
      "order_method": "Pre Order",
      "product_id": "1",
      "p_name": "Milk Bread",
      "quantity": "5",
      "product_price": "20",
      "order_creation_date": "2025-10-29T13:22:16.684Z",
      "status": "Waiting for payment",
      "status_update_date": null,
      "payment_proof": null,
      "shipping_destination": "Bangkok Thailand"
    },
    {
      "order_id": "48",
      "order_method": "Pre Order",
      "product_id": "4",
      "p_name": "Chocolate Cake",
      "quantity": "10",
      "product_price": "60",
      "order_creation_date": "2025-10-29T13:23:16.383Z",
      "status": "Waiting for payment",
      "status_update_date": null,
      "payment_proof": null,
      "shipping_destination": "Bangkok Thailand"
    },
    {
      "order_id": "48",
      "order_method": "Pre Order",
      "product_id": "2",
      "p_name": "White Bread",
      "quantity": "5",
      "product_price": "30",
      "order_creation_date": "2025-10-29T13:23:16.383Z",
      "status": "Waiting for payment",
      "status_update_date": null,
      "payment_proof": null,
      "shipping_destination": "Bangkok Thailand"
    }
];

export default reformatOrdersFunctional;