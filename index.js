const postcss = require('postcss');
const escRgx = require('escape-string-regexp');

module.exports = postcss.plugin('postcss-variable-media', (options = {}) => {
	let breakpoints = options.breakpoints || {},
		breakpointRegex = registerBreakpoints(breakpoints),
		regularAtRules = ['media', 'charset', 'import', 'namespace', 'supports', 'document', 'page', 'font-face', 'keyframes', 'viewport', 'counter-style', 'font-feature-values'],
		registry = {};

	/**
	 * Create regex to identify breakpoints
	 *
	 * @param {object} breakpoints
	 * @returns {RegExp}
	 */
	function registerBreakpoints(breakpoints) {
		let register = [];

		Object.keys(breakpoints)
			.forEach(name => {
				register.push('(^' + escRgx(name) + '$)');
			});

		if (! register.length) {
			return false;
		}

		return new RegExp(register.join('|'));
	}

	return (root, result) => {
		if (! breakpointRegex) {
			return root.warn(result, 'No breakpoints registered.');
		}

		if (options.consolidate) {
			// Consolidate Rules
			root.walkAtRules(rule => {
				let name = rule.name;

				if (breakpointRegex.test(name)) {
					if (registry.hasOwnProperty(name)) {
						registry[name].nodes = (registry[name].nodes || []).concat(rule.nodes);
					} else {
						registry[name] = postcss.atRule({
							name: rule.name,
							params: rule.params,
							raws: Object.assign(rule.raws, {afterName: ' '}),
							nodes: rule.nodes
						});
					}

					rule.remove();
				}
			});

			Object.keys(registry).forEach(key => {
				let rule = registry[key];

				rule.params = `(min-width: ${breakpoints[rule.name]}px)`;
				rule.name = 'media';

				root.append(rule);
			});
		} else {
			root.walkAtRules(rule => {
				let name = rule.name;

				if (breakpointRegex.test(name)) {
					rule.params = `(min-width: ${breakpoints[name]}px)`;
					rule.name = 'media ';
				}
			});
		}
	};
});