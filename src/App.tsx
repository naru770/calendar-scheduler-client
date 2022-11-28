import { BrowserRouter, Route, Routes } from "react-router-dom";

import Calendar from "./components/Calendar";
import Setting from "./components/Setting";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
