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
		rule.raws.between = ' ';

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
			rule.nodes.forEach(rule => registry[name].append(rule));
		} else {
			registry[name] = rule.clone();
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
				let before = rule.raws.before;

				convertBreakpointToMedia(rule);
				root.append(rule);
				
				// This is a hack to ensure that more readable unminified format
				// is retained for top level at-rules that are
				// being appended. root.append was causing before: '\n'
				// to be stripped out so that it was only before: ''
				let appendedRule = root.nodes[root.nodes.length - 1];
				
				if (appendedRule.prev()) {
					appendedRule.raws.before = '\n';
				}
			});

			// Reset registry after finishing each file/module
			// Use mqpacker for consolidating across multiple stylesheets
			registry = {};
		} else {
			root.walkAtRules(rule => {
				if (breakpointRegex.test(rule.name)) {
					convertBreakpointToMedia(rule);
				}
			});
		}
	};
});