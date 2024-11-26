const pool = require("../database/dbconfig");

const verifyAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ 
                status: false, 
                message: "No authorization header provided" 
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({ 
                status: false, 
                message: "No token provided" 
            });
        }

        const sql = "SELECT * FROM admin WHERE auth = ?";
        pool.query(sql, [token], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    status: false, 
                    message: "Internal server error" 
                });
            }

            if (results.length === 0) {
                return res.status(401).json({ 
                    status: false, 
                    message: "Invalid authentication token" 
                });
            }

            
            req.admin = results[0];
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            status: false, 
            message: "Authentication error" 
        });
    }
};

module.exports = verifyAuth;
