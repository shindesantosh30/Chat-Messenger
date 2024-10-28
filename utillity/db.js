const { Op, fn, col } = require('sequelize');

/**
 * Utility function to build a where clause for dynamic searching.
 * @param {Array} searchableFields - Array of field names that are searchable.
 * @param {Object} queryParams - The request.query object containing the search parameters.
 * @returns {Object} whereClause - The constructed where clause for Sequelize.
 */
const simpleSearch = (searchableFields, queryParams) => {
    const whereClause = {};

    searchableFields.forEach((field) => {
        if (queryParams[field]) {
            // Use LOWER() function for MySQL, iLIKE for PostgreSQL
            whereClause[field] = {
                [Op.like]: fn('LOWER', col(field)), // Ensure the field is lower-cased
                [Op.like]: `%${queryParams[field].toLowerCase()}%`, // Lowercase query term
            };
        }
    });

    return whereClause;
}

/**
 * Utility function to build a where clause for full-text searching.
 * @param {Array} searchableFields - Array of field names that are searchable.
 * @param {Object} queryParams - The request.query object containing the search parameters.
 * @returns {Object} whereClause - The constructed where clause for Sequelize.
 */
const fullTextSearch = (searchableFields, query) => {
    const whereClause = {};

    if (!query) { return whereClause; }

    whereClause[Op.or] = searchableFields.map((field) => ({
        [field]: {
            [Op.like]: fn('LOWER', col(field)), // This will convert the column value to lower case
            [Op.like]: `%${query.toLowerCase()}%`, // This should be the query part
        },
    }));
    return whereClause;
};

module.exports = {
    simpleSearch,
    fullTextSearch,
}
