// transform employees, departments (fbs) and find unique deps ...
const normalizeDepartments = (dept: Record<string, boolean>) =>
    Object.keys(dept).filter(key => dept[key]).map(key => key.toUpperCase());

const normalizeEmployees = (emp: any) => {
    const permanent = +emp.permanent || 0;
    const freelance = +emp.freelance || 0;
    return { permanent, freelance, total: Math.round((permanent + freelance) * 100) / 100 };
};

export const parseAndNormalizeDocumentData = (documentData: string) => {
    if (!documentData) throw new Error('Invalid document data');

    const doc = JSON.parse(documentData);
    const fbCounts: Record<string, number> = {};

    // Normalize and count central departments
    const central = doc.central;
    const centralDepts = normalizeDepartments(central?.centralMeasuresDepartments || {});
    central.centralMeasuresDepartments = centralDepts;
    for (const fb of centralDepts) {
        fbCounts[fb] = (fbCounts[fb] || 0) + 1;
    }

    // Normalize central employees
    central.employees = normalizeEmployees({
        permanent: central.permanentEmployees,
        freelance: central.freelanceWorkers
    });

    // Normalize and count other locations
    const otherLocations = doc.otherLocations || [];
    for (const loc of otherLocations) {
        loc.department = normalizeDepartments(loc.department || {});
        loc.employees = normalizeEmployees(loc.employees);

        const seen = new Set<string>();
        for (const fb of loc.department) {
            if (!seen.has(fb)) {
                fbCounts[fb] = (fbCounts[fb] || 0) + 1;
                seen.add(fb);
            }
        }
    }

    // Normalize implementation departments and put it in a new array for further use
    if (doc.implementationOfMeasures) {
        doc.implementationOfMeasures.department = normalizeDepartments(doc.implementationOfMeasures);
    }

    // Get unique FBs
    doc.uniqueDeps = Object.keys(fbCounts).filter(fb => fbCounts[fb] === 1);

    return doc;
};
