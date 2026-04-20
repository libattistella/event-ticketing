import { ErrorBoundary } from "./components/utils";
import { Wizard } from "./components/wizard";

export function App() {
  return (
    <div className="h-full w-full">
      <ErrorBoundary>
        <Wizard />
      </ErrorBoundary>
    </div>
  );
}

export default App;
