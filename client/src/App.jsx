import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import UnauthorizedPage from "./routes/UnauthorizedPage";
import Events from "./routes/Events";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Marketplace from "./routes/MarketPlace";
import Notifications from "./routes/Notifications";

function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "unauthorized", element: <UnauthorizedPage /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      element: <ProtectedRoute />, 
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { path: "", element: <Events /> }, 
            { path: "marketplace", element: <Marketplace /> },
             { path: "notifications", element: <Notifications /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
