import { Navigate } from "react-router-dom";
import {
  getCurrentUser,
  checkRole,
} from "../../controller/auth_controller/auth_controller";

export const IsNotAuthenticated = ({ children }) => {
  const auth = getCurrentUser();
  console.log(auth);

  if (auth != null) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

export const IsAuthenticated = ({ children }) => {
  const auth = getCurrentUser();

  if (auth != null) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export const IsExpert = ({ children }) => {
  const auth = getCurrentUser();

  if (auth != null) {
    if (checkRole(auth.uid) == "expert") {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export const IsAdmin = ({ children }) => {
  const auth = getCurrentUser();

  if (auth != null) {
    if (checkRole(auth.uid) == "admin") {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};
