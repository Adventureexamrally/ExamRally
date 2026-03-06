import React from 'react';

const SectionSummaryModal = ({
    showModal,
    sectionSummaryData,
    popupmodal,
    handleSectionCompletion,
    currentSectionIndex,
    examData
}) => {
    if (!showModal) return null;

    return (
        <div
            className="modal"
            tabIndex="-1"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
            style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                minHeight: "100vh",
            }}
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1
                            className="modal-title fs-5 text-green-500"
                            id="staticBackdropLabel"
                        >
                            Section Submit
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={popupmodal} // Manually hide the modal
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-success text-white">
                                    <tr>
                                        <th>Section Name</th>
                                        <th>Total Ques</th>
                                        <th>Answered</th>
                                        <th>Not Answered</th>
                                        <th>Visited Questions</th>
                                        <th>Not Visited Questions</th>
                                        <th>Marked for Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sectionSummaryData.map((summary, index) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{summary.sectionName}</td>
                                            <td>{summary.totalQuestions}</td>
                                            <td>{summary.answeredQuestions}</td>
                                            <td>{summary.notAnsweredQuestions}</td>
                                            <td>{summary.visitedQuestionsCount}</td>
                                            <td>{summary.notVisitedQuestions}</td>
                                            <td>{summary.reviewedQuestions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="d-flex justify-content-center w-100">
                            <button
                                type="button"
                                className="btn btn-success"
                                data-bs-dismiss="modal"
                                onClick={handleSectionCompletion} // Check completion and move to next section
                            >
                                {currentSectionIndex === examData?.section?.length - 1
                                    ? "Submit"
                                    : "Next Section"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionSummaryModal;
