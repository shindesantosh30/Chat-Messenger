const constant = require('./constants')


function getPaginationResponse(data, request) {

    const total_count = data.length || 0;

    if (request.query.type && request.query.type === 'all') {
        return { data, total_count };
    }

    const page = request.query.page || constant.PAGE_SIZE;
    const limit = request.query.limit || constant.PAGE_LIMIT;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const categoryData = data.slice(startIndex, endIndex);
    const total_pages = Math.ceil(total_count / limit);

    const paginator = {
        total_count,
        total_pages,
        current_page: page,
        limit,
    };
    if (total_pages < page) {
        return { data: [], paginator };
    }

    return { data: categoryData, paginator };
}


function getSerializerError(serializer, withKey = false) {
    const msgList = [];
    try {
        const myDict = serializer.errors;
        const keys = Object.keys(myDict).sort();

        keys.forEach((key) => {
            let msg = "";

            if (withKey) {
                msg = `${key} : `;
            }

            msg += myDict[key][0];

            msgList.push(msg);
        });
    } catch (error) {
        msgList.push("Invalid format");
    }
    return msgList;
}


function isAlpha(input) {
    const words = input.split(' ');

    for (const word of words) {
        if (!areWordsAlpha(word)) {
            return false;
        }
    }
    return true;
}

function areWordsAlpha(str) {
    return /^[A-Za-z]+$/.test(str);
}


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


module.exports = {
    getPaginationResponse,
    validateEmail,
    isAlpha
}