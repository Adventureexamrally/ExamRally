import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { getSectionCounts } from './testUtils';
import { toast } from 'react-toastify';

const SectionTabBar = ({
    examData,
    currentSectionIndex,
    selectedLanguage,
    selectedOptions,
    visitedQuestions,
    markedForReview,
    submittedSections,
    displayLanguage,
    setDisplayLanguage,
    setCurrentSectionIndex,
    setClickedQuestionIndex
}) => {

    if (!examData?.section) return null;

    // First, group sections
    const groupedSections = [];
    const sectionGroups = {};

    examData.section.forEach((section, index) => {
        const isSubSection = section.is_sub_section;
        const groupName = isSubSection ? section.group_name : section.name;

        if (!sectionGroups[groupName]) {
            // Create new group
            const newGroup = {
                groupName,
                sections: [],
                isGroup: isSubSection,
            };
            sectionGroups[groupName] = newGroup;
            groupedSections.push(newGroup);
        }

        sectionGroups[groupName].sections.push({
            ...section,
            globalIndex: index
        });
    });

    // Check if current section is in a group
    const currentSection = examData.section[currentSectionIndex];
    const activeGroupName = currentSection?.is_sub_section ? currentSection.group_name : currentSection?.name;

    return (
        <div className="w-full">
            {/* Main Group Tab Bar — matches reference layout */}
            <div className="flex items-center justify-between bg-white border-b border-gray-200 px-2">
                <div className="flex flex-wrap">
                    {groupedSections.map((group, groupIndex) => {
                        const isActiveGroup = group.groupName === activeGroupName;

                        // Calculate combined counts for the group
                        let totalAnswered = 0, totalNotAnswered = 0, totalNotVisited = 0, totalMarked = 0, totalAnsMarked = 0;

                        group.sections.forEach(sec => {
                            const startingIndex = examData.section
                                .slice(0, sec.globalIndex)
                                .reduce((acc, s) => acc + (s?.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);

                            const counts = getSectionCounts(sec, selectedOptions, visitedQuestions, markedForReview, selectedLanguage, startingIndex);
                            totalAnswered += counts.answered;
                            totalNotAnswered += counts.notAnswered;
                            totalNotVisited += counts.notVisited;
                            totalMarked += counts.markedForReviewCount;
                            totalAnsMarked += counts.answeredAndMarked;
                        });

                        const handleGroupClick = () => {
                            // Section tab clicks are blocked — must use Submit Section to advance
                            const firstSecIndex = group.sections[0].globalIndex;
                            if (firstSecIndex === currentSectionIndex) return; // already on this section

                            if (submittedSections.has(firstSecIndex)) {
                                toast.error("This section has already been submitted. You cannot go back.");
                                return;
                            }
                            // Prevent jumping ahead — must submit current section first
                            toast.warning("Please submit the current section to proceed.");
                        };

                        return (
                            <div key={groupIndex} className="relative group/tab">
                                <div
                                    onClick={handleGroupClick}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors border-b-2 ${isActiveGroup
                                        ? 'border-blue-500 text-blue-600'
                                        : group.sections.every(s => submittedSections.has(s.globalIndex))
                                            ? 'border-transparent text-gray-400 cursor-not-allowed'
                                            : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300'
                                        }`}
                                >
                                    <span>{group.groupName}</span>
                                    {/* Submitted checkmark */}
                                    {group.sections.every(s => submittedSections.has(s.globalIndex)) && (
                                        <span className="ml-1 text-green-500 text-xs">✓ Submitted</span>
                                    )}
                                    {/* Info tooltip */}
                                    <div className="relative group inline-block">
                                        <FaInfoCircle className={`text-xs cursor-pointer ${isActiveGroup ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <div className="absolute z-50 hidden group-hover:block bg-white text-dark border rounded p-2 shadow-lg mt-1 min-w-[220px] w-max left-1/2 -translate-x-1/2 top-full">
                                            <div className="mt-2 flex align-items-center">
                                                <div className="smanswerImg text-white fw-bold flex align-items-center justify-content-center">{totalAnswered}</div>
                                                <p className="ml-2 text-start mb-0 text-sm">Answered</p>
                                            </div>
                                            <div className="mt-2 flex align-items-center">
                                                <div className="smnotansImg text-white fw-bold flex align-items-center justify-content-center">{totalNotAnswered}</div>
                                                <p className="ml-2 text-start mb-0 text-sm">Not Answered</p>
                                            </div>
                                            <div className="mt-2 flex align-items-center">
                                                <div className="smnotVisitImg fw-bold flex align-items-center justify-content-center">{totalNotVisited}</div>
                                                <p className="ml-2 text-start mb-0 text-sm">Not Visited</p>
                                            </div>
                                            <div className="mt-2 flex align-items-center">
                                                <div className="smmarkedImg text-white fw-bold flex align-items-center justify-content-center">{totalMarked}</div>
                                                <p className="ml-2 text-start mb-0 text-sm">Marked for Review</p>
                                            </div>
                                            <div className="mt-2 flex align-items-center">
                                                <div className="smansmarkedImg text-white fw-bold flex align-items-center justify-content-center">{totalAnsMarked}</div>
                                                <p className="ml-2 text-start mb-0 text-sm">Answered & Marked for Review</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Language dropdown — right aligned in same row */}
                {examData && examData.section?.[currentSectionIndex]?.name?.toLowerCase().trim() !== "english language" && (
                    <div className="flex-shrink-0 pr-2">
                        <select
                            value={displayLanguage || selectedLanguage}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        >
                            {examData?.bilingual_status ? (
                                <>
                                    {examData?.english_status && <option value="English">English</option>}
                                    {examData?.hindi_status && <option value="Hindi">Hindi</option>}
                                </>
                            ) : (
                                <>
                                    {examData?.english_status && <option value="English">English</option>}
                                    {examData?.hindi_status && <option value="Hindi">Hindi</option>}
                                    {examData?.tamil_status && <option value="Tamil">Tamil</option>}
                                </>
                            )}
                        </select>
                    </div>
                )}
            </div>

            {/* Sub Tabs — rectangular tabs matching reference image */}
            {(() => {
                const activeGroup = groupedSections.find(g => g.groupName === activeGroupName);
                const shouldShowSubTabs = activeGroup && activeGroup.isGroup;
                if (!shouldShowSubTabs) return null;

                return (
                    <div className="flex flex-wrap items-center gap-1 bg-white border-b border-gray-200 px-4 py-1.5">
                        {activeGroup.sections.map((sec, secIdx) => {
                            const isSecActive = currentSectionIndex === sec.globalIndex;

                            const handleSubSectionClick = () => {
                                if (sec.globalIndex === currentSectionIndex) return; // already here

                                // Allow free switching within the SAME group
                                const currentSection = examData?.section?.[currentSectionIndex];
                                const inSameCumulativePool =
                                    currentSection?.is_sub_section &&
                                    sec.is_sub_section &&
                                    currentSection.group_name === sec.group_name;

                                if (inSameCumulativePool) {
                                    // Free switching within the pooled sub-sections
                                    const newStartingIndex = examData.section
                                        .slice(0, sec.globalIndex)
                                        .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
                                    setCurrentSectionIndex(sec.globalIndex);
                                    setClickedQuestionIndex(newStartingIndex);
                                    return;
                                }

                                // Cross-group navigation: check if submitted
                                if (submittedSections.has(sec.globalIndex)) {
                                    toast.error("This section has already been submitted. You cannot go back.");
                                    return;
                                }
                                toast.warning("Please submit the current section to proceed.");
                            };

                            return (
                                <button
                                    key={secIdx}
                                    onClick={handleSubSectionClick}
                                    className={`px-4 py-1 text-sm font-medium transition-all border rounded flex items-center gap-1 ${isSecActive
                                        ? 'bg-white border-gray-400 text-gray-800 shadow-sm'
                                        : submittedSections.has(sec.globalIndex)
                                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                                        }`}
                                >
                                    {sec.name}
                                    {submittedSections.has(sec.globalIndex) && (
                                        <span className="text-green-500 text-xs">✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
};

export default SectionTabBar;
