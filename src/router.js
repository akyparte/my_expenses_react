import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import AddExpensesPage from "./Components/add-enpenses-page";
import ExpensesList from "./Components/expenses-list";

export default function ExpensesRouter(){
    return (
        <Router>
           <Routes>
               <Route path="/add-expenses" element={<AddExpensesPage></AddExpensesPage>} />
               <Route path="/expenses-list" element={<ExpensesList></ExpensesList>} />
               <Route path="/" element={<LoginPage></LoginPage>} />
           </Routes>
        </Router>
    );
}