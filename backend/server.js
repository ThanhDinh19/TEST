
const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./db");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(cors({
    origin: "*"
}));

// Kiểm tra Backend
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running!"
    });
});

// Kiểm tra kết nối Database
app.get("/api/db-test", async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(
            "SELECT DB_NAME() AS DatabaseName"
        );

        res.json({
            success: true,
            message: "Database connected!",
            database: result.recordset[0].DatabaseName
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Lấy danh sách Users từ SQL Server
app.get("/api/users", async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT Id, FullName, Email, CreatedAt
            FROM dbo.Users
            ORDER BY Id DESC
        `);

        res.json({
            success: true,
            total: result.recordset.length,
            data: result.recordset
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Cannot retrieve users"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at port ${PORT}`);
});
