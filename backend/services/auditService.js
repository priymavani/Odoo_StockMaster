const AuditLog = require('../models/AuditLog');

async function logAudit({ userId, action, entity, entityId, payload }, session) {
  const doc = {
    user: userId || undefined,
    action,
    entity,
    entityId,
    payload,
  };

  await AuditLog.create([doc], session ? { session } : {});
}

module.exports = { logAudit };
