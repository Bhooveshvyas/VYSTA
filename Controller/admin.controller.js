const prisma = require('../Config/db.js')

async function getAdminStats(req, res) {
    try {
        const totalUsers = await prisma.user.count({ where: { role: 'user' } });
        const totalOrders = await prisma.order.count();
        const totalProducts = await prisma.product.count();

        const orders = await prisma.order.findMany();
        const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0)
        res.json({ totalOrders, totalProducts, totalUsers, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAdminStats }