export const authMe = async (req, res) => {
    try {
        const user = req.user; // lấy user từ authMiddleware

        return res.status(200).json({ user });
    } catch (error) {
        console.error("lỗi khi gọi authMe: ", error);
        return res.status(500).json({ message: "Lộ hệ thống" });
    }
};

export const test = async (req, res) => {
    return res.sendStatus(204);
};
