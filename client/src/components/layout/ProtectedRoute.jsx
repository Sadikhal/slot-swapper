import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loginSuccess, loginStart, loginFailure } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import { Loader } from "../../components/ui/Loaders";
import { apiRequest } from "../../lib/apiRequest";

const ProtectedRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      dispatch(loginStart());
      setIsChecking(true);
      try {
        const res = await apiRequest.get("/auth/user");
        if (mounted && res?.data) {
          dispatch(loginSuccess(res.data));
        } else {
          dispatch(loginFailure("No session"));
        }
      } catch (err) {
        const message = err.response?.data?.message || "Session check failed. Please login again.";
        if (mounted) {
          dispatch(loginFailure(message));
          toast.error(message);
        }
      } finally {
        if (mounted) setIsChecking(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (isChecking || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
