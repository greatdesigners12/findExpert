import { Navigate } from "react-router-dom";
import {
  getCurrentUser,
  checkRole,
} from "../../controller/auth_controller/auth_controller";
import { useContext } from "react";
import { UserContext } from "../../context/authContext.js";

export const IsNotAuthenticated = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData !== "") {
    if (userData == null) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  }
};

export const IsNotAuthenticatedSmallComponent = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData !== "") {
    if (userData === null) {
      return children;
    }
  }
};

export const IsAuthenticated = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);
  if (userData != "") {
    console.log(userData);
    if (userData != null) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  }
};

export const IsAuthenticatedSmallComponent = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);
  if (userData !== "") {
    if (userData !== null) {
      return children;
    }
  }
};

export const IsExpert = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData != "") {
    if (userData != null) {
      if (userData.displayName == "expert") {
        return children;
      } else {
        return <Navigate to="/" />;
      }
    } else {
      return <Navigate to="/login" />;
    }
  }
};

export const IsExpertSmallComponent = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData !== "") {
    if (userData != null) {
      if (userData.displayName == "expert") {
        return children;
      }
    }
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

export const IsAdminSmallComponent = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData !== "") {
    if (userData != null) {
      if (userData.displayName == "admin") {
        return children;
      }
    }
  }
};

export const IsUserSmallComponent = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData !== "") {
    if (userData != null) {
      if (userData.displayName == "user") {
        return children;
      }
    }
  }
};
