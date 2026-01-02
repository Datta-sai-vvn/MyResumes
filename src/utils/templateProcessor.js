/**
 * Merges generated sections into the base template using markers
 * @param {string} baseTemplate 
 * @param {object} sections 
 * @returns {string} Merged LaTeX
 */
export function mergeSections(baseTemplate, sections) {
    let merged = baseTemplate;

    // Replace Summary section
    if (sections.summary) {
        merged = merged.replace(
            /% MARKER_BEGIN_SUMMARY[\s\S]*?% MARKER_END_SUMMARY/,
            `% MARKER_BEGIN_SUMMARY\n${sections.summary}\n% MARKER_END_SUMMARY`
        );
    }

    // Replace Skills section
    if (sections.skills) {
        merged = merged.replace(
            /% MARKER_BEGIN_SKILLS[\s\S]*?% MARKER_END_SKILLS/,
            `% MARKER_BEGIN_SKILLS\n${sections.skills}\n% MARKER_END_SKILLS`
        );
    }

    // Replace Projects section
    if (sections.projects) {
        merged = merged.replace(
            /% MARKER_BEGIN_PROJECTS[\s\S]*?% MARKER_END_PROJECTS/,
            `% MARKER_BEGIN_PROJECTS\n${sections.projects}\n% MARKER_END_PROJECTS`
        );
    }

    return merged;
}

/**
 * Extract current sections from template (for comparison/reset)
 * @param {string} template 
 * @returns {object} Extracted sections
 */
export function extractSections(template) {
    const summaryMatch = template.match(/% MARKER_BEGIN_SUMMARY\n([\s\S]*?)\n% MARKER_END_SUMMARY/);
    const skillsMatch = template.match(/% MARKER_BEGIN_SKILLS\n([\s\S]*?)\n% MARKER_END_SKILLS/);
    const projectsMatch = template.match(/% MARKER_BEGIN_PROJECTS\n([\s\S]*?)\n% MARKER_END_PROJECTS/);

    return {
        summary: summaryMatch ? summaryMatch[1].trim() : null,
        skills: skillsMatch ? skillsMatch[1].trim() : null,
        projects: projectsMatch ? projectsMatch[1].trim() : null
    };
}

/**
 * Validate that all required markers exist
 * @param {string} template 
 * @returns {object} Validation result
 */
export function validateMarkers(template) {
    const requiredMarkers = [
        'MARKER_BEGIN_SUMMARY',
        'MARKER_END_SUMMARY',
        'MARKER_BEGIN_SKILLS',
        'MARKER_END_SKILLS',
        'MARKER_BEGIN_PROJECTS',
        'MARKER_END_PROJECTS'
    ];

    const missingMarkers = requiredMarkers.filter(
        marker => !template.includes(`% ${marker}`)
    );

    return {
        valid: missingMarkers.length === 0,
        missingMarkers
    };
}
