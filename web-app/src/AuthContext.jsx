import {createContext, useState, useContext, useEffect} from "react";
import PropTypes from "prop-types";
import loginUser from "./api/auth/LoginRequest.jsx";
import {Spin} from "antd";

const AuthContext = createContext(undefined);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setUser({token});
        }
        setIsLoading(false);
    }, []);

    const login = async (loginData) => {
        try {
            const token = await loginUser(loginData);
            localStorage.setItem("access_token", token);
            setUser({token});
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    if (isLoading) {
        return <Spin/>;
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    return useContext(AuthContext);
};
