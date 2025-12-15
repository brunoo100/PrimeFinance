import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Error from "../Pages/Error";
import { MainLayout } from "../Components/Layout";
import Login from "../Pages/Login";
import PrivateRoutes from "./PrivateRoutes";
import Dashbord from "../Pages/Dashbord";
import Inserir from "../Pages/Inserir";
import Register from "../Pages/Registre";
import EditarMovimentacao from "../Pages/Editar";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes with layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashbord />} />
            <Route path="/inserir" element={<Inserir />} />
          <Route
          path="/movimentacao/editar/:id"
          element={<EditarMovimentacao />}
        />
          </Route>
        </Route>

        {/* Error page */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<Error />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
