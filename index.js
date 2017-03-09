const init, { createFromSession } = require('universal-analytics');
module.exports = (tid, { cookieName = '_ga' } = {}) => {

	return (ctx, next) => {

		ctx.state.visitor = createFromSession(ctx.session);

		if (ctx.state.visitor) return next();

		let cid = null;
		if (ctx.cookies && ctx.cookies[cookieName]) {
      try {
        cid = ctx.cookies[cookieName].split('.').slice(2).join('.);
      } catch(e) {}
		}

		req.visitor = init(tid, cid, options);

		if (req.session) {
			req.session.cid = req.visitor.cid;
		}

		return next();
	}
}