import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC_CUS, (err, cus) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.cus = cus;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export { verifyToken };
