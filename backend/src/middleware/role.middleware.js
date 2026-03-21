
export const protectrole = (...role) => {
    return (req, res, next) => {
        if (!req.user || !role.includes(req.user.role)) {
            console.log("Not authorized from role middleware");
            return res.status(403).json({ message: "Not authorized to access this route" });
        }
        next(); 
    }
}