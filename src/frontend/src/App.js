import { useState } from "react";
import "./App.css";

// Pages
import { Customers } from "./components/pages/Customer";

function App() {
  const [view, setView] = useState("clientes");

  function renderView() {
    switch (view) {
      case "clientes":
        return <Customers />;
      case "mecanicos":
        return <h1>Implementando tela de mecanicos...</h1>;
      case "pecas":
        return <h1>Implementando tela de peças...</h1>;
      case "servicos":
        return <h1>Implementando tela de serviços...</h1>;

      default:
        return <Customers />;
    }
  }

  return (
    <div className="App">
      <nav className="view-picker">
        <button onClick={() => setView("clientes")}>Clientes</button>
        <button onClick={() => setView("mecanicos")}>Mecânicos</button>
        <button onClick={() => setView("pecas")}>Peças</button>
        <button onClick={() => setView("servicos")}>Serviços</button>
      </nav>

      <div className="content">{renderView()}</div>
    </div>
  );
}

export default App;
