
const getRequiredFields = (fields, requestBody) => {
    for (let field of fields) {
        const value = requestBody[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            const formattedField = field
                .split('_')
                .map((word, index) => index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    : word.toLowerCase()
                )
                .join(' ');

            return `${formattedField} is required`;
        }
    }
};


module.exports = {
    getRequiredFields,
}