// --- COMPONENT 1: ChartBar (Visual UI) ---
// Renders a single bar in the chart.
// Height is calculated dynamically via CSS style.

const ChartBar = ({ value, maxValue, label }) => {
    let barFillHeight = '0%';

    if (maxValue > 0) {
        barFillHeight = Math.round((value / maxValue) * 100) + '%';
    }

    return (
        <div className="flex flex-col items-center h-full">
            <div className="h-24 w-4 border border-slate-700 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
                <div
                    className="bg-indigo-400 w-full transition-all duration-500 ease-out"
                    style={{ height: barFillHeight }}
                ></div>
            </div>
            <div className="font-bold text-xs text-center mt-2 text-slate-400">{label}</div>
        </div>
    );
};

export default ChartBar;