import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // thường dưới 15m

const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày theo mi li giây

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "Không thể thiếu username, password, email, firstName, lastName",
            });
        }

        // Kiểm tra xem user có tồn tại chưa
        const duplicate = await User.findOne({ username });

        if (duplicate) {
            return res.status(409).json({ message: "username đã tồn tại" });
        }

        // mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

        // tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        // return
        return res.status(204);
    } catch (error) {
        console.error("lỗi khi gọi signUp: ", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signIp = async (req, res) => {
    try {
        // Lấy inputs
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).jsn({ message: "Thiếu username hoặc password" });
        }

        // lấy hashedPassword rong db so sánh với password input
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "username hoặc password không chính xác" });
        }

        // Kiểm tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "username hoặc password không chính xác" });
        }

        // nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_TTL,
        });

        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // tạo session mới để lưu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // gửi refresh token về trong cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // backend, frontend deploy riêng
            maxAge: REFRESH_TOKEN_TTL,
        });

        // trả access token về trong res
        return res
            .status(200)
            .json({ message: `User ${user.displayName} đã logeed in!`, accessToken });
    } catch (error) {
        console.error("lỗi khi gọi signIn: ", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
