const prisma = require('../Config/db.js')

async function getReviews(req, res) {
    const productId = Number(req.params.id);
    try {
        const reviews = await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
}

async function addReview(req, res) {
    const productId = Number(req.params.id);
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const hasPurchased = await prisma.order.findFirst({
            where: {
                userId: req.user.id,
                status: 'Delivered',
                items: {
                    some: { productId: productId }
                }
            }
        });

        if (!hasPurchased) {
            return res.status(403).json({ error: 'You can only review products you have purchased and received' });
        }

        const existingReview = await prisma.review.findFirst({
            where: { userId: req.user.id, productId }
        });

        let review;
        if (existingReview) {
            review = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating: Number(rating), comment }
            });
        } else {
            review = await prisma.review.create({
                data: {
                    userId: req.user.id,
                    productId,
                    name: req.user.name,
                    rating: Number(rating),
                    comment
                }
            });
        }

        const allReviews = await prisma.review.findMany({
            where: { productId },
            select: { rating: true }
        });

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await prisma.product.update({
            where: { id: productId },
            data: {
                ratings: avgRating,
                numReviews: allReviews.length
            }
        });

        const updatedProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: { reviews: true }
        });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to add review' });
    }
}

async function deleteReview(req, res) {
    const productId = Number(req.params.id);
    const { reviewId } = req.body;

    try {
        const review = await prisma.review.findUnique({ where: { id: Number(reviewId) } });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this review' });
        }

        await prisma.review.delete({ where: { id: Number(reviewId) } });

        const allReviews = await prisma.review.findMany({
            where: { productId },
            select: { rating: true }
        });

        const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;

        await prisma.product.update({
            where: { id: productId },
            data: {
                ratings: avgRating,
                numReviews: allReviews.length
            }
        });

        const updatedProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: { reviews: true }
        });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete review' });
    }
}

module.exports = {
    getReviews,
    addReview,
    deleteReview
};