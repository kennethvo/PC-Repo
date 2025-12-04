import SavedReportsList from "./../SavedReportsList";

const SavedReportsPage = (savedReports, deleteReportHandler) => {
    return (
        <div>
            <h1>Saved Reports</h1>
            
            <SavedReportsList
                reports={savedReports}
                onDelete={deleteReportHandler} />
        </div>
    );
};

export default SavedReportsPage