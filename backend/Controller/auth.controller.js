const prisma = require('../Config/db.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
function generateToken(id) {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );

}



async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "all fields are required!!..",
                success: false
            })
        }
        // console.log("YAHA TK ARHA HAI");
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({
                message: "User already exist with this e-mail!!..",
                success: false
            })
        }
        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hash }
        });

        const token = generateToken(user.id);

        return res.status(201).json({
            message: "User sucesslly Registered in.",
            data: {
                id: user.id, name: user.name, email: user.email, token
            }
        })
    } catch (error) {
        console.error("internal server error: ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}



async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "all fields are required!!..",
                success: false
            })
        }
        const exists = await prisma.user.findUnique({ where: { email } });
        if (!exists) {
            return res.status(400).json({
                message: "User does not exist with this e-mail!!..",
                success: false
            })
        }
        const match = await bcrypt.compare(password, exists.password);

        if (!match) {
            return res.status(400).json({
                message: "Invalid credentials.",
                success: false
            })
        }

        const token = generateToken(exists.id);

        return res.status(201).json({
            message: "User sucesslly logged in in.",
            data: {
                id: exists.id, email: exists.email, token
            }
        })
    } catch (error) {
        console.error("internal server error: ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}



async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json({
            message: "Users Fetched successfully",
            data: {
                users
            }
        })
    } catch (error) {
        console.error("internal server error: ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


async function logoutUser(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    await prisma.blacklistedToken.create({
        data: {
            token,
        },
    });

    res.clearCookie("token");

    return res.json({
        success: true,
        message: "Logout successful",
    });
};

async function profile(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            data: {
                user
            }
        });
    } catch (error) {
        console.error("internal server error: ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match",
                success: false
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const match = await bcrypt.compare(oldPassword, user.password);

        if (!match) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });
    } catch (error) {
        console.error("Internal server error: ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

/*
    async function forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }

            // 1. Prisma me findUnique use karein (email field par @unique constraint hona chahiye)
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found with this email" });
            }

            // 2. Random token generate karein
            const resetToken = crypto.randomBytes(32).toString("hex");

            // 3. Token ko hash karein (Security ke liye)
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

            // 4. Prisma me user.save() nahi hota, yahan hum prisma.user.update() use karenge
            await prisma.user.update({
                where: { email },
                data: {
                    resetPasswordToken: hashedToken,
                    resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000), // PostgreSQL/Prisma ke liye Date object zaroori hai
                },
            });

            // 5. Reset URL generate karein
            const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

            const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:'Segoe UI', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:40px 0;">
        <tr>
        <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
                <td style="background-color:#4f46e5; padding:28px 32px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:600;">
                    🔒 Password Reset Request
                </h1>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:32px;">
                <p style="margin:0 0 16px; color:#333333; font-size:15px; line-height:1.6;">
                    Hello,
                </p>
                <p style="margin:0 0 24px; color:#333333; font-size:15px; line-height:1.6;">
                    We received a request to reset your password. Click the button below to set a new password.
                </p>

                <!-- Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                    <tr>
                    <td align="center" style="border-radius:8px; background-color:#4f46e5;">
                        <a href="${resetUrl}" target="_blank" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; border-radius:8px;">
                        Reset Password
                        </a>
                    </td>
                    </tr>
                </table>

                <p style="margin:0 0 8px; color:#666666; font-size:13px; line-height:1.6;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px; word-break:break-all; font-size:13px;">
                    <a href="${resetUrl}" target="_blank" style="color:#4f46e5;">${resetUrl}</a>
                </p>

                <div style="background-color:#fff7ed; border-left:3px solid #f59e0b; padding:12px 16px; border-radius:6px; margin-bottom:8px;">
                    <p style="margin:0; color:#92400e; font-size:13px; line-height:1.5;">
                    ⏱ This link is valid for <strong>15 minutes</strong> only.
                    </p>
                </div>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding:20px 32px; background-color:#fafafa; border-top:1px solid #eeeeee;">
                <p style="margin:0; color:#999999; font-size:12px; line-height:1.6; text-align:center;">
                    If you didn't request this, you can safely ignore this email — your password will not be changed.
                </p>
                </td>
            </tr>

            </table>
        </td>
        </tr>
    </table>
    </body>
    </html>`;

            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message,
            });

            res.status(200).json({
                success: true,
                message: "Password reset link sent to your email",
            });
        } catch (error) {
            console.error("forgotPassword error:", error);
            res.status(500).json({ success: false, message: "Something went wrong, try again later" });
        }
    };
*/

module.exports = { registerUser, loginUser, getUsers, logoutUser, profile, changePassword };