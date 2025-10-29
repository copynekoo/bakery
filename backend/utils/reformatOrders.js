function reformatOrdersFunctional(originalData) {
    // Group orders by order_id using Map to preserve order
    const groupedOrders = originalData.reduce((acc, order) => {
        const orderId = order.order_id;
        if (!acc.has(orderId)) {
            acc.set(orderId, []);
        }
        acc.get(orderId).push(order);
        return acc;
    }, new Map());
    
    // Convert Map to array and reformat - this preserves insertion order
    return Array.from(groupedOrders).map(([orderId, orderItems]) => {
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

export default reformatOrdersFunctional;