const expect = require('chai').expect;
const should = require('chai').should;
const postcss = require('postcss');
const plugin = require('./');
const fs = require('fs');

function process(input, expected, opts = {}, warnings = 0) {
	return postcss([ plugin(opts) ]).process(input)
		.then(result => {
			expect(result.css).to.equal(expected);
			expect(result.warnings().length).to.equal(warnings);
		});
}

function file(path) {
	return fs.readFileSync(path, 'utf8');
}

describe('module', () => {
	it('should throw warning if referenced breakpoint does not exist', () => {
		let input = file('./cases/module-input.css');

		return process(input, input, {}, 1);
	});
});

describe('breakpoints', () => {
	it('should be replaced with min-width media queries', () => {
		let input = file('./cases/breakpoints/base.css'),
			output = file('./cases/breakpoints/base.out.css');

		return process(input, output,
			{
				breakpoints: {
					tablet: 768
				}
			}
		);
	});

	it('should be able to have multiple registered', () => {
		let path = './cases/breakpoints/multiple-registered';

		return process(file(path + '.css'), file(path + '.out.css'), {
				breakpoints: {
					mobile: 450,
					tablet: 768,
					desktop: 1024
				}
			});
	});

	it('should not be confused with regular atRules', () => {
		let path = './cases/breakpoints/with-atrules';

		return process(file(path + '.css'), file(path + '.out.css'), {
				breakpoints: {
					mobile: 450,
					tablet: 768,
					desktop: 1024
				}
			});
	});
});

describe('media queries', () => {
	it('should be consolidated when options.consolidate = true', () => {
		let path = './cases/media-queries/consolidate';

		return process(file(path + '.css'), file(path + '.out.css'), {
				breakpoints: {
					tablet: 768
				},
				consolidate: true
			});
	});

	it('should be left in place if options.consolidate = false', () => {
		let path = './cases/media-queries/no-consolidate';

		return process(file(path + '.css'), file(path + '.out.css'), {
				breakpoints: {
					tablet: 768
				},
				consolidate: false
			});
	});
});

describe('consolidated media queries', () => {
	it('should be appended at the end of the document', () => {
		let path = './cases/consolidated-queries/end-of-doc';

		return process(file(path + '.css'), file(path + '.out.css'), {
				breakpoints: {
					tablet: 768,
					desktop: 1024
				},
				consolidate: true
			});
	});
});