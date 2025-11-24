import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
    try {
        // lấy token từ header
    } catch (error) {
        console.error("lỗi khi xác minh JWT trong authMiddleware: ", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
