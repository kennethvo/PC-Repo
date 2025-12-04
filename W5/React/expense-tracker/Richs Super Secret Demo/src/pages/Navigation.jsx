import { Link } from "react-router-dom";

const Navigation = () => {
    // NOTE: In a real app, useLocation() hook is better for highlighting active links
    // But for now, simple links work fine.
    return (
        <nav className="bg-indigo-900 shadow-md mb-8">
            <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-white font-bold text-xl flex items-center gap-2">
                    📊 ExpenseTracker
                </div>
                <div className="flex gap-2">
                    <Link to="/dashboard" className="text-indigo-100 hover:bg-indigo-800 font-bold px-4 py-2 rounded-lg transition-colors">Dashboard</Link>
                    <Link to="/add-expense" className="text-indigo-100 hover:bg-indigo-800 font-bold px-4 py-2 rounded-lg transition-colors">Add New</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;