import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";

function Placeholder({ name }: { name: string }) {
  return <h1 className="text-2xl font-semibold text-ink">{name}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Placeholder name="Dashboard" />} />
          <Route path="beers" element={<Placeholder name="Cervejas" />} />
          <Route path="tanks" element={<Placeholder name="Tanques" />} />
          <Route path="records" element={<Placeholder name="Registros" />} />
          <Route
            path="batches"
            element={<Placeholder name="Historico de Lotes" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
