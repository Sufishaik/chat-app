import jwt from "jsonwebtoken";

export const verifyToken = (request, resp, next) => {

    const token = request.cookies.jwt;
    if (!token) return resp.status(401).send("You are not authorized to access this route");
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) return resp.status(403).send("Token is not Valid");
        request.userId = payload.userId;
        next();
    })
}   