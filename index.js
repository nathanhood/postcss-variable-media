const postcss = require('postcss');
const escRgx = require('escape-string-regexp');

module.exports = postcss.plugin('postcss-variable-media', (options = {}) => {
	options = Object.assign({
			consolidate: true
		}, options);

	let breakpoints = options.breakpoints || {},
		breakpointRegex = registerBreakpoints(breakpoints),
		registry = {};

	/**
	 * Create regex to identify breakpoints
	 *
	 * @param {object} breakpoints
	 * @returns {RegExp}
	 */
	function registerBreakpoints(breakpoints) {
		let register = [];

		Object.keys(breakpoints).forEach(name => {
			register.push('(^' + escRgx(name) + '$)');
		});

		if (! register.length) {
			return false;
		}

		return new RegExp(register.join('|'));
	}

	/**
	 * Turn breakpoint to media
	 *
	 * @param {postcss.Container} rule - AtRule
	 * @returns {*}
	 */
	function convertBreakpointToMedia(rule) {
		rule.params = `(min-width: ${breakpoints[rule.name]}px)`;
		rule.name = 'media';
		rule.raws.afterName = ' ';

		return rule;
	}

	/**
	 * Add breakpoint to registry
	 *
	 * @param {object} rule - AtRule
	 */
	function addToRegistry(rule) {
		let name = rule.name;

		if (registry.hasOwnProperty(name)) {
			registry[name].nodes = (registry[name].nodes || []).concat(rule.nodes);
		} else {
			registry[name] = postcss.atRule({
				name: rule.name,
				params: rule.params,
				raws: Object.assign({}, rule.raws),
				nodes: rule.nodes
			});
		}
	}

	return (root, result) => {
		if (! breakpointRegex) {
			return root.warn(result, 'No breakpoints registered.');
		}

		if (options.consolidate) {
			root.walkAtRules(rule => {
				if (breakpointRegex.test(rule.name)) {
					addToRegistry(rule);

					rule.remove();
				}
			});

			Object.keys(registry).forEach(key => {
				let rule = registry[key];

				convertBreakpointToMedia(rule);
				root.append(rule);
			});
		} else {
			root.walkAtRules(rule => {
				if (breakpointRegex.test(rule.name)) {
					convertBreakpointToMedia(rule);
				}
			});
		}
	};
});