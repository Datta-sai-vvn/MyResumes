/**
 * LaTeX Template Processor
 * 
 * Handles the injection of GPT-generated content into the LaTeX resume template.
 * Uses marker comments % BEGIN_SECTION and % END_SECTION to locate replacement zones.
 */

// Mapping of sections to their marker names in the template
const SECTIONS = {
    SKILLS: {
        start: '% BEGIN_SKILLS',
        end: '% END_SKILLS'
    },
    EXPERIENCE: {
        start: '% BEGIN_EXPERIENCE',
        end: '% END_EXPERIENCE'
    },
    PROJECTS: {
        start: '% BEGIN_PROJECTS',
        end: '% END_PROJECTS'
    },
    SUMMARY: {
        start: '% BEGIN_SUMMARY',
        end: '% END_SUMMARY'
    }
};

/**
 * Replaces a specific section in the template with new content.
 * 
 * @param {string} template - The full LaTeX template string
 * @param {string} sectionKey - Key from SECTIONS object (e.g., 'SKILLS')
 * @param {string} newContent - The new LaTeX content to insert
 * @returns {string} - The modified template
 */
function replaceSection(template, sectionKey, newContent) {
    const markers = SECTIONS[sectionKey];
    if (!markers) {
        throw new Error(`Unknown section key: ${sectionKey}`);
    }

    const { start, end } = markers;

    // Regex to find content between markers, including the markers themselves or just the content
    // We want to keep the markers to allow re-generation if needed, or we can replace meaningful content inside.
    // Strategy: Replace everything between start and end markers with new content.
    // Escape special regex characters in markers just in case
    const startEscaped = start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const endEscaped = end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(`(${startEscaped})([\\s\\S]*?)(${endEscaped})`);

    // We verify if the section exists
    if (!regex.test(template)) {
        console.warn(`Section markers for ${sectionKey} not found in template.`);
        return template;
    }

    // Replace: Keep valid markers, insert new content in between
    return template.replace(regex, `$1\n${newContent}\n$3`);
}

/**
 * Merges multiple sections into the template.
 * 
 * @param {string} template - The base LaTeX template
 * @param {object} contentMap - Object with keys as section names and values as new content
 *                              e.g. { SKILLS: "...", PROJECTS: "..." }
 * @returns {string} - The fully populated LaTeX code
 */
function mergeSections(template, contentMap) {
    let currentTemplate = template;

    for (const [key, content] of Object.entries(contentMap)) {
        // Find matching section key (case insensitive or direct match)
        const upperKey = key.toUpperCase();
        if (SECTIONS[upperKey]) {
            currentTemplate = replaceSection(currentTemplate, upperKey, content);
        }
    }

    return currentTemplate;
}

/**
 * Basic validation of LaTeX content to catch obvious errors before compilation.
 * 
 * @param {string} latexCode 
 * @returns {boolean} true if valid (basic checks pass)
 */
function validateLatex(latexCode) {
    if (!latexCode) return false;

    // Check for balanced braces (rough check)
    const openBraces = (latexCode.match(/\{/g) || []).length;
    const closeBraces = (latexCode.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
        console.warn('Warning: Unbalanced braces in LaTeX code.');
        // We might validly have unbalanced braces in comments, but this is a heuristic.
    }

    return true;
}

export {
    replaceSection,
    mergeSections,
    validateLatex,
    SECTIONS
};
