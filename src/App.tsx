import React from "react";
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Login } from "./components/login/Login";
import { PasswordFinder } from "./components/login/PasswordFinder";

interface Menu {
  path: string
  element: JSX.Element
}

const menus: Menu[]  = [
  {path : '/', element: <Login/> },
  {path : '/passwordFinder', element: <PasswordFinder/> }
]

const App = () => (
  <BrowserRouter>
    <AnimatePresence>
      <Routes>
        {
          menus.map(menu => {
            return (
              <Route path={menu.path} element={menu.element} />      
            )
          })
        }
      </Routes>
    </AnimatePresence>
</BrowserRouter>
);

export default App;