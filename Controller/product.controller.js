const prisma = require('../Config/db.js')
const cloudinary = require('../Config/cloudinary.js')

async function createProduct(req, res) {
    try {
        const { name, description, price, category, stock } = req.body;
        let imgUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url
        }
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                stock: parseFloat(stock),
                imageUrl: imgUrl
            }
        });
        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function getProducts(req, res) {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve products' });
    }
}

async function getProductById(req, res) {
    const id = req.params.id;
    try {
        const product = await prisma.product.findUnique({ where: { id: Number(id) } })
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve product' });
    }
}


async function updateProduct(req, res) {
    const id = Number(req.params.id);
    const { name, description, price, category, stock } = req.body;
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: Number(price),
                category,
                stock: Number(stock)
            }
        });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update product' });
    }
}

async function deleteProduct(req, res) {
    const id = Number(req.params.id);
    try {
        await prisma.product.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete product' });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    getProductById,
    deleteProduct
};