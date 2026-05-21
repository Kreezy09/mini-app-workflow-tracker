import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./layouts/AppLayout";
import { ApplicationCreatePage } from "./pages/ApplicationCreatePage";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { ApplicationEditPage } from "./pages/ApplicationEditPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ApplicationListPage />} />
          <Route path="applications/new" element={<ApplicationCreatePage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="applications/:id/edit" element={<ApplicationEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
