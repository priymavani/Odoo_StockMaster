const { getDashboard } = require('../services/dashboardService');
const { success } = require('../utils/response');

async function handleDashboard(req, res, next) {
  try {
    const data = await getDashboard();
    return success(res, data, 'Dashboard');
  } catch (err) {
    return next(err);
  }
}

module.exports = { handleDashboard };
