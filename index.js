const ua = require('universal-analytics');

module.exports = (tid, options = {}) => {
  const { cookieName = '_ga' } = options;
  return (ctx, next) => {
    ctx.state.visitor = ua.createFromSession(ctx.session);

    if (ctx.state.visitor) return next();

    let cid = null;
    if (ctx.cookies && ctx.cookies[cookieName]) {
      try {
				// Google Analytics cookie are normally - GA1.2.590908120.1488500648
        cid = ctx.cookies[cookieName].split('.').slice(2).join('.');
      } catch (e) {}
    }

    ctx.state.visitor = ua(tid, cid, options);

    if (ctx.session) {
      ctx.session.cid = ctx.state.visitor.cid;
    }

    return next();
  };
};
