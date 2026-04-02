/**
 * GlobalResponseHandler — utils/GlobalResponseHandler.js
 *
 * Registered once in app.js via app.use(GlobalResponseHandler).
 * Attaches res.success() and res.failed() to every request
 * across the entire application — auth, workspace, team, channel, messages.
 *
 * Usage in any controller:
 *   res.success("User created.", { user })
 *   res.success("Data fetched.", { items }, 200)
 *
 * Usage in GlobalErrorHandler:
 *   res.failed("Not found.", {}, 404)
 *   res.failed("Forbidden.", {}, 403)
 */
const GlobalResponseHandler = (req, res, next) => {
  res.success = (message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.failed = (message, data = {}, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  };

  next();
};

module.exports = GlobalResponseHandler;
