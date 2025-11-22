function success(res, data, message = 'OK') {
  return res.json({ error: false, message, data });
}

module.exports = { success };
