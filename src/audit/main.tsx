import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { AuditPage } from "./AuditPage"
import "./audit.css"

createRoot(document.getElementById("audit-root")!).render(
  <StrictMode>
    <AuditPage />
  </StrictMode>,
)
