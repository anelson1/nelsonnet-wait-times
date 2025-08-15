import "./App.css";
import WaitTime from "./components/WaitTime/WaitTime";

function App() {

  return (
    <main className="container">
      <WaitTime parkId={6} parkName="Magic Kingdom" />
      <div className="divider" />
      <WaitTime parkId={5} parkName="Epcot" />
      <div className="divider" />
      <WaitTime parkId={7} parkName="Hollywood Studios" />
      <div className="divider" />
      <WaitTime parkId={8} parkName="Animal Kingdom" />
    </main>
  );
}

export default App;
