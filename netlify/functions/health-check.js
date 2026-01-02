exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'ok',
            message: 'Resume Automation Backend is running',
            timestamp: new Date().toISOString()
        }),
    };
};
