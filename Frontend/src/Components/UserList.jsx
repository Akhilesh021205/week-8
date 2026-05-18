import { useEffect, useState } from "react";
import User from "./User";
import { getApiUrl } from "../apiConfig";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const apiUrl = getApiUrl();
        if (!apiUrl) {
          throw new Error(
            "Backend API URL is not configured. Set VITE_API_URL in production or deploy the backend at the same origin."
          );
        }

        const res = await fetch(`${apiUrl}/user-api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          let errorMessage = "Failed to fetch users";
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error("Failed to parse fetch error response:", parseError);
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        setUsers(data.payload || data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    getUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Users List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default UserList;