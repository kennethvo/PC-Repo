// --- COMPONENT 2: Chart (Wrapper) ---
// Generic chart component. It doesn't know about "expenses", just "dataPoints".

import ChartBar from './ChartBar';

const Chart = ({ dataPoints }) => {
    const dataPointValues = dataPoints.map(dataPoint => dataPoint.value);
    const totalMaximum = Math.max(...dataPointValues); // Find the biggest month to scale bars relative to it

    return (
        <div className="p-4 bg-slate-900 rounded-xl flex justify-around h-40 mb-6 border border-slate-800">
            {dataPoints.map((dataPoint) => (
                <ChartBar
                    key={dataPoint.label}
                    value={dataPoint.value}
                    maxValue={totalMaximum}
                    label={dataPoint.label}
                />
            ))}
        </div>
    );
};

export default Chart;