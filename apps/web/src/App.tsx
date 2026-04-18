import { ErrorBoundary } from "./components/utils";
import { Wizard } from "./components/wizard";

export function App() {
  return (
    <ErrorBoundary>
      <Wizard />
    </ErrorBoundary>
  );
}

export default App;
