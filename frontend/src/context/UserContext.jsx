import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // Gọi API logout để xóa cookie httpOnly
            await fetch("http://localhost:8081/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
        
        localStorage.removeItem("user");
        setUser(null);
        navigate('/login');
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;