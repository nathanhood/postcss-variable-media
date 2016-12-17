const expect = require('chai').expect;
const should = require('chai').should;
const postcss = require('postcss');
const plugin = require('./');

function process(input, expected, opts = {}, warnings = 0) {
	return postcss([ plugin(opts) ]).process(input)
		.then(result => {
			expect(result.css).to.equal(expected);
			expect(result.warnings().length).to.equal(warnings);
		});
}

describe('module', () => {
	it('should throw warning if referenced breakpoint does not exist', () => {
		return process(
			`@tablet {
				.block {
					background: #fff;
				}
			}`,
			`@tablet {
				.block {
					background: #fff;
				}
			}`,
			{},
			1
		);
	});
});

describe('breakpoints', () => {
	it('should be replaced with min-width media queries', () => {
		return process(
			`@tablet {
				.block {
					background: #fff;
				}
			}`,
			`@media (min-width: 768px) {
				.block {
					background: #fff;
				}
			}`,
			{
				breakpoints: {
					tablet: 768
				}
			}
		);
	});

	it('should be able to have multiple registered', () => {
		return process(
			`@mobile {
				.block {
					background: yellow;
				}
			}
			@tablet {
				.block {
					background: #fff;
				}
			}
			@desktop {
				.block {
					background: #000;
				}
			}`,
			`@media (min-width: 450px) {
				.block {
					background: yellow;
				}
			}
			@media (min-width: 768px) {
				.block {
					background: #fff;
				}
			}
			@media (min-width: 1024px) {
				.block {
					background: #000;
				}
			}`,
			{
				breakpoints: {
					mobile: 450,
					tablet: 768,
					desktop: 1024
				}
			}
		);
	});

	it('should not be confused with regular atRules', () => {
		return process(
			`@import url('file.css');
			@charset "UTF-8";
			@mobile {
				.block {
					background: yellow;
				}
			}
			@media (min-width: 500px) {
				.block {
					background: blue;
				}
			}
			@tablet {
				.block {
					background: #fff;
				}
			}
			@desktop {
				.block {
					background: #000;
				}
			}`,
			`@import url('file.css');
			@charset "UTF-8";
			@media (min-width: 450px) {
				.block {
					background: yellow;
				}
			}
			@media (min-width: 500px) {
				.block {
					background: blue;
				}
			}
			@media (min-width: 768px) {
				.block {
					background: #fff;
				}
			}
			@media (min-width: 1024px) {
				.block {
					background: #000;
				}
			}`,
			{
				breakpoints: {
					mobile: 450,
					tablet: 768,
					desktop: 1024
				}
			}
		);
	});
});

describe('media queries', () => {
	it('should be consolidated when options.consolidate = true', () => {
		return process(
			`@tablet {
				.block {
					background: #fff;
				}
			}
			@tablet {
				.block2 {
					background: #000;
				}
			}`,
			`@media (min-width: 768px) {
				.block {
					background: #fff;
				}
				.block2 {
					background: #000;
				}
			}`,
			{
				breakpoints: {
					tablet: 768
				},
				consolidate: true
			}
		);
	});

	it('should be left in place if options.consolidate = false', () => {
		return process(
			`@tablet {
				.block {
					background: #fff;
				}
			}
			@tablet {
				.block2 {
					background: #000;
				}
			}`,
			`@media (min-width: 768px) {
				.block {
					background: #fff;
				}
			}
			@media (min-width: 768px) {
				.block2 {
					background: #000;
				}
			}`,
			{
				breakpoints: {
					tablet: 768
				},
				consolidate: false
			}
		);
	});
});