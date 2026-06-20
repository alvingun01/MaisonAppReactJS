import { HttpService } from "./httpService";

export const OrderService = {
    order: {},
    orders: [],
    loadOrders(authErrorCallback) {
        HttpService.getOrders().then((response) => {
            this.orders.length = 0; // Clear array in place to preserve references
            if (Array.isArray(response)) {
                response.forEach(order => this.orders.push(order));
            }
        }).catch((error) => {
            if (authErrorCallback) authErrorCallback();
            console.error('Error fetching orders:', error);
        });
    },

    createOrder(cartItems, paymentInfo, shippingCost, subtotal, discount) {
        // Map frontend order payload to match Django Relational Schema
        const backendOrder = {
            id: "ORD-" + Date.now(),
            date: new Date().toISOString(),
            first_name: paymentInfo.firstName,
            last_name: paymentInfo.lastName,
            email: paymentInfo.email,
            phone: paymentInfo.phone,
            line1: paymentInfo.line1,
            line2: paymentInfo.line2 || "",
            city: paymentInfo.city,
            zip_code: paymentInfo.zip,
            country: paymentInfo.country,
            payment_mode: paymentInfo.currPaymentMode,
            shipping_cost: shippingCost,
            subtotal: subtotal,
            discount: discount,
            total: subtotal + shippingCost - discount,
            items: Object.values(cartItems).map(item => ({
                product: item.id,
                quantity: item.quantity || 1,
                price_at_purchase: item.price
            }))
        }

        HttpService.createOrder(backendOrder).then((response) => {
            this.orders.push(response);
        }).catch((error) => {
            console.error('Error creating order:', error);
        });

        this.order = {
            ...backendOrder,
            shippingCost: shippingCost,
            products: Object.values(cartItems).map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity || 1,
                price: item.price
            }))
        };
        return this.order;
    },

    getOrder() {
        return this.orders;
    },

    getOrders() {
        return HttpService.getOrders();
    },

    getOrderById(id) {
        return this.orders.find(order => order.id === id);
    },

    updateOrder(order) {
        HttpService.updateOrder(order).then((response) => {
            const index = this.orders.findIndex(item => item.id === order.id);
            if (index !== -1) {
                this.orders[index] = response;
            }
        }).catch((error) => {
            console.error('Error updating order:', error);
        });
    },

    deleteOrder(id) {
        HttpService.deleteOrder(id).then((response) => {
            const index = this.orders.findIndex(order => order.id === id);
            if (index !== -1) {
                this.orders.splice(index, 1);
            }
        }).catch((error) => {
            console.error('Error deleting order:', error);
        });
    },

    clearOrder() {
        this.orders.length = 0;
    },
}