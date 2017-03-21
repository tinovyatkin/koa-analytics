const ua = require('universal-analytics');

module.exports = (tid, options = {}) => {
  const { cookieName = '_ga' } = options;
  return (ctx, next) => {
    const context = {
      ua: ctx.get('user-agent'),
      dr: ctx.get('referrer'),
      uip: ctx.ip,
    };
    if ('gclid' in ctx.query) context.gclid = ctx.query.gclid;

    if (ctx.session && ctx.session.cid) {
      ctx.state.visitor = ua(tid, ctx.session.cid, options, context);
      if (ctx.state.visitor) return next();
    }

    let cid = null;
    if (ctx.cookies && ctx.cookies[cookieName]) {
      try {
				// Google Analytics cookie are normally - GA1.2.590908120.1488500648
        cid = ctx.cookies[cookieName].split('.').slice(2).join('.');
      } catch (e) {}
    }

    ctx.state.visitor = ua(tid, cid, options, context);

    if (ctx.session) {
      ctx.session.cid = ctx.state.visitor.cid;
    }

    return next();
  };
};
