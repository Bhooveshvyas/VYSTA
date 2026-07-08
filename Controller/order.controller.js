const prisma = require('../Config/db.js')
const sendEmail = require('../Utils/sendMail.js')

async function addOrderItems(req, res) {
    const { items, totalAmount, address, paymentId } = req.body;
    try {
        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = await prisma.order.create({
                data: {
                    userId: req.user.id,
                    totalAmount,
                    fullName: address.fullName,
                    street: address.street,
                    city: address.city,
                    postalCode: address.postalCode,
                    country: address.country,
                    paymentId,
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            qty: item.qty,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: true   // response mein items wapas chahiye to
                }
            })

            const message = `
            <h2>Order Confirmation</h2>
            <p>Hello ${req.user.name},</p>
            <p>Your order has been successfully placed! Order ID: <strong>${order.id}</strong></p>
            <p>Total Amount Paid: $${totalAmount.toFixed(2)}</p>
            <p>It will be shipped to: ${address.street}, ${address.city}</p>
            <p>Thank you for shopping with ShopNest!</p>
          `;


            await sendEmail({
                email: req.user.email,
                subject: `ShopNest - Order Confirmation(Order ID : ${order.id})`,
                message
            });

            res.status(201).json(order);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getOrders(req, res) {
    try {
        const orders = await prisma.order.findMany();
        return res.status(200).json({
            success: true,
            message: "Fetched Orders",
            orders
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMyOrders(req, res) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                items: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "Fetched Orders",
            orders
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateOrderStatus(req, res) {
    const orderId = Number(req.params.id);
    try {
        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: req.body.status
            }
        })
        return res.status(200).json({
            message: "Order updated",
            success: true,
            order
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

async function updateOrder(req, res) {
    const orderId = Number(req.params.id);
    const { items, totalAmount, address, paymentId } = req.body;

    try {
        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                totalAmount,
                fullName: address.fullName,
                street: address.street,
                city: address.city,
                postalCode: address.postalCode,
                country: address.country,
                paymentId,
                items: {
                    deleteMany: {}, // Remove existing items
                    create: items.map(item => ({
                        productId: item.productId,
                        qty: item.qty,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });
        return res.status(200).json({
            message: "Order updated",
            success: true,
            order
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            success: false
        });
    }
}

async function deleteOrder(req, res) {
    const orderId = Number(req.params.id);
    try {
        await prisma.order.delete({
            where: {
                id: orderId
            }
        });
        return res.status(200).json({
            message: "Order deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

async function getOrderById(req, res) {
    const orderId = Number(req.params.id);
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                items: true
            }
        });
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Order fetched successfully",
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

module.exports = { addOrderItems, getOrders, getMyOrders, updateOrderStatus, updateOrder, getOrderById, deleteOrder }