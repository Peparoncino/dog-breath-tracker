import RecordList from "./components/RecordList";
import Stopwatch from "./components/Stopwatch";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div>
      <ThemeToggle />
      <Stopwatch />
      <RecordList />
    </div>
  )
}

export default App