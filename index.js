const init, { createFromSession } = require('universal-analytics');
module.exports = (tid, options = {}) => {
	const { cookieName = '_ga' } = options;
	return (ctx, next) => {

		ctx.state.visitor = createFromSession(ctx.session);

		if (ctx.state.visitor) return next();

		let cid = null;
		if (ctx.cookies && ctx.cookies[cookieName]) {
      try {
        cid = ctx.cookies[cookieName].split('.').slice(2).join('.);
      } catch(e) {}
		}

		ctx.state.visitor = init(tid, cid, options);

		if (req.session) {
			ctx.session.cid = ctx.state.visitor.cid;
		}

		return next();
	}
}