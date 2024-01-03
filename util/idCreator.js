
const createUniqueId = () => {
    const randomPart = Math.random().toString(36).substring(2,9);
    const timestampPart = Date.now().toString(36);
    return randomPart + timestampPart;
}

module.exports = {
    createUniqueId: createUniqueId
}