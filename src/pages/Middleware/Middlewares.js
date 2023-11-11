import { Navigate } from "react-router-dom";
import {
  getCurrentUser,
  checkRole,
} from "../../controller/auth_controller/auth_controller";
import { useContext } from "react";
import { UserContext } from "../../context/authContext.js";

export const IsNotAuthenticated = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData != null && userData != "") {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

export const IsAuthenticated = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);
  if (userData != "") {
    if (userData != null) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  }
};

export const IsExpert = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData != null && userData != "") {
    if (userData.displayName == "expert") {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export const IsAdmin = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData != null && userData != "") {
    if (userData.displayName == "admin") {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};
