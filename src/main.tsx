
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./workspace.css";
  import { WorkspaceProvider } from './state/Workspace';

  createRoot(document.getElementById("root")!).render(<WorkspaceProvider><App /></WorkspaceProvider>);
  
