import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {

    // ***** Accessing the token that is sent as cookie during login.
    const token = req.cookies.token;

    console.log("Token received:", token);

    if (!token) {
        return res.status(401).json({
            message: "Please log in first"
        });
    }

    try {
        // **** Decoding the token that is sent in the coookie.
        const decoded = jwt.verify(token, process.env.SECRET);

        console.log("Decoded user:", decoded);

        req.user = decoded;

        next();
    }
    catch (err) {
        console.log("JWT Error:", err.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export default authMiddleware;