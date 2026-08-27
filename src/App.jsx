// import SignIn from "./SignIn";
// //import Products from "./Products";

// function App() {
//   return <SignIn />;
//   //return <Products />;
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./SignIn";
import Products from "./Products";
import SignUp from "./SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
