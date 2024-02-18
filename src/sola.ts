import { type LogLevel, type LogType, LogTypes } from './log'
import { Basic } from './reporters/basic'
import type { Reporter } from './reporters/reporter'

type SolaArgs = {
	tag?: string
	level?: LogLevel
	parent?: Sola
	reporters?: Array<Reporter>
}

const defaultReporters = [new Basic()]

/**
 * Core sola class
 * @example
 * ```ts
 * const sola = new Sola({ tag: 'my-app' })
 *
 * sola.log('hello sola'); // <- my-app hello sola
 *
 * const customTag = sola.withTag('mytag')
 *
 * customTag.log('hello sola'); // <- my-app:mytag hello sola
 * ```
 */
export class Sola {
	tag: string
	parent?: Sola
	level?: LogLevel
	reporters: Array<Reporter>

	constructor(args?: SolaArgs) {
		const { tag = '', parent, level, reporters = defaultReporters } = args ?? {}

		this.level = level
		this.tag = tag
		this.parent = parent
		this.reporters = reporters
	}

	#logType(type: LogType, args: Array<unknown>) {
		const level = this.getLevel()
		const { reporters, tag } = this

		if (level >= LogTypes[type]) {
			for (const reporter of reporters) {
				reporter.log({
					tag,
					type,
					args,
				})
			}
		}
	}

	log(...args: Array<unknown>) {
		this.#logType('log', args)
	}

	error(...args: Array<unknown>) {
		this.#logType('error', args)
	}

	warn(...args: Array<unknown>) {
		this.#logType('warn', args)
	}

	debug(...args: Array<unknown>) {
		this.#logType('debug', args)
	}

	getLevel(): number {
		const { level } = this
		if (typeof level === 'number') {
			// different from its parent
			return level
		}

		return this.parent?.getLevel() ?? 3
	}

	withTag(tag: string) {
		return new Sola({
			tag: this.tag ? `${this.tag}:${tag}` : `${tag}`,
			parent: this,
		})
	}
}
