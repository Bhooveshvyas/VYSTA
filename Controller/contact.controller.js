const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                phone,
                subject,
                message,
            },
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: contact,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createContact };