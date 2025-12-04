import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav>
            <div>
                <h2>ExpenseTracker </h2>
            </div>
            <div>
                <Link to="/dashboard">Expenses</Link>
                <Link to="/reports">Reports</Link>
            </div>
        </nav>
    );
};

export default Navigation;