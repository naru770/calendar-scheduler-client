import { BrowserRouter, Route, Routes } from "react-router-dom";

import Calendar from "./components/Calendar";
import Setting from "./components/Setting";
import * as Snackbar from "./components/Snackbar";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
      <Snackbar.Component />
    </BrowserRouter>
  );
};

export default App;
