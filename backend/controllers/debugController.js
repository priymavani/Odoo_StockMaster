const { getDebugState } = require('../services/debugService');
const { success } = require('../utils/response');

async function handleDebugState(req, res, next) {
  try {
    const data = await getDebugState();
    return success(res, data, 'Debug state');
  } catch (err) {
    return next(err);
  }
}

module.exports = { handleDebugState };
