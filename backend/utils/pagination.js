function buildPagination(page = 1, size = 10) {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const s = Math.max(Math.min(parseInt(size, 10) || 10, 100), 1);
  const skip = (p - 1) * s;
  const limit = s;
  return { page: p, size: s, skip, limit };
}

module.exports = { buildPagination };
