import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { TanksPage } from "./pages/TanksPage";
import { BeersPage } from "./pages/BeersPage";
import { RecordsPage } from "./pages/RecordsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BatchHistoryPage } from "./pages/BatchHistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="beers" element={<BeersPage />} />
          <Route path="tanks" element={<TanksPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="batches" element={<BatchHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
