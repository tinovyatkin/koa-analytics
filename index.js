const ua = require('universal-analytics');

module.exports = (tid, options = {}) => {
  const { cookieName = '_ga' } = options;
  return (ctx, next) => {
    const opt = Object.assign({
      userAgentOverride: ctx.get('user-agent'),
      documentReferrer: ctx.get('referrer'),
    }, options);
    if (ctx.session && ctx.session.cid) {
      ctx.state.visitor = ua(tid, ctx.session.cid, opt);
      if (ctx.state.visitor) return next();
    }

    let cid = null;
    if (ctx.cookies && ctx.cookies[cookieName]) {
      try {
				// Google Analytics cookie are normally - GA1.2.590908120.1488500648
        cid = ctx.cookies[cookieName].split('.').slice(2).join('.');
      } catch (e) {}
    }

    ctx.state.visitor = ua(tid, cid, opt);

    if (ctx.session) {
      ctx.session.cid = ctx.state.visitor.cid;
    }

    return next();
  };
};
