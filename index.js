const ua = require('universal-analytics');

module.exports = (tid, options = {}) => {
  const { cookieName = '_ga' } = options;
  return (ctx, next) => {
    const persistentParams = {
      ua: ctx.get('user-agent'),
      dr: ctx.get('referrer'),
      uip: ctx.ip
    };
    if ('gclid' in ctx.query) persistentParams.gclid = ctx.query.gclid;
    for (const prop in persistentParams) {
      if (!persistentParams[prop]) delete persistentParams[prop];
    }

    const opt = Object.assign(
      { headers: { 'User-Agent': ctx.get('User-Agent') } },
      options
    );

    let cid = null;
    if (ctx.cookies && ctx.cookies[cookieName]) {
      try {
        // Google Analytics cookie are normally - GA1.2.590908120.1488500648
        cid = ctx.cookies[cookieName].split('.').slice(2).join('.');
      } catch (e) {
        console.error(e);
      }
    } else if (ctx.session && ctx.session.cid) {
      Object.assign(persistentParams, ctx.session.ga_params || {});
      ctx.state.visitor = ua(tid, ctx.session.cid, opt, null, persistentParams);
      if (ctx.state.visitor) return next();
    }

    ctx.state.visitor = ua(tid, cid, opt, null, persistentParams);

    if (ctx.session) {
      ctx.session.cid = ctx.state.visitor.cid;
      ctx.session.ga_params = persistentParams;
    }

    return next();
  };
};
