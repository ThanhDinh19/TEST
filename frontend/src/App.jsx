
import { useEffect, useState } from "react";
import "./App.css";

// Tự lấy IP của máy chủ từ địa chỉ website đang truy cập
const API_URL = `http://${window.location.hostname}:3000/api`;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu Users");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("API trả về lỗi");
      }

      setUsers(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Web Server Management</h1>
          <p>React + Node.js + SQL Server</p>
        </div>

        <span className="status">● Server Lab</span>
      </header>

      <main className="container">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>User Management</h2>
              <p>Danh sách người dùng từ SQL Server</p>
            </div>

            <button onClick={fetchUsers}>
              Làm mới dữ liệu
            </button>
          </div>

          {loading && <p>Đang tải dữ liệu...</p>}

          {error && (
            <p className="error">
              Lỗi: {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="total">
                Tổng số người dùng: <strong>{users.length}</strong>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.Id}>
                        <td>{user.Id}</td>
                        <td>{user.FullName}</td>
                        <td>{user.Email}</td>
                        <td>
                          {user.CreatedAt
                            ? new Date(user.CreatedAt).toLocaleString("vi-VN")
                            : ""}
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
