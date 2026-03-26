const userResponse = (user, token = null) => {
    const response = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    if (token) {
        response.token = token;
    }

    return response;
};

module.exports = {
    userResponse
};
