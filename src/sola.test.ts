import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Sola } from './'

const testReporter = {
	log: vi.fn(),
}

function create() {
	return new Sola({
		reporters: [testReporter],
	})
}

beforeEach(() => {
	testReporter.log.mockReset()
})

it('should have level 3 by default', () => {
	const sola = create()
	expect(sola.getLevel()).toBe(3)
})

it('should log an error', () => {
	const sola = create()

	sola.error('value')

	expect(testReporter.log).toHaveBeenCalledOnce()
	expect(testReporter.log).toHaveBeenCalledWith(expect.objectContaining({
		type: 'error',
		tag: '',
		args: expect.arrayContaining(['value']),
	}))
})

it('should inherit parent\'s tag', () => {
	const sola = create()
	const fooSola = sola.withTag('foo')
	const barSola = fooSola.withTag('bar')

	expect(barSola.tag).toBe('foo:bar')
})

it('should share parent\'s level', () => {
	const sola = create()

	sola.level = 4

	const fooSola = sola.withTag('foo')

	expect(fooSola.getLevel()).toBe(4)
})

describe('when set a level', () => {
	it('should ignore parent\'s level', () => {
		const sola = create()

		sola.level = 4

		const fooSola = sola.withTag('foo')

		fooSola.level = 2
		expect(fooSola.getLevel()).toBe(2)
	})
})
