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

  if (userData != "") {
    if (userData != null) {
      if (userData.displayName == "admin") {
        return children;
      } else {
        return <Navigate to="/" />;
      }
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export const HomeCheckerForUser = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);

  if (userData != "") {
    if (userData != null) {
      if (userData.displayName === "admin") {
        return <Navigate to="/admin-transactions" />;
      }else if(userData.displayName === "expert"){
        return <Navigate to="/homeexpert" />;
      } else {
        return children
      }
    }else{
      return children
    }
  } else {
    return children;
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

export const IsNotUserSmallComponent = ({ children }) => {
  const { userData, setUser } = useContext(UserContext);
  if (userData == null) {
    return children;
  }
};
