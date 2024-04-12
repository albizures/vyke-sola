import { type LogLevel, type LogType, LogTypes } from './log'
import { Basic } from './reporters/basic'
import type { Reporter } from './reporters/reporter'

type RedactPath = Array<string>
type Redact = Array<RedactPath>

type SolaArgs = {
	tag?: string
	level?: LogLevel
	parent?: Sola
	redact?: Redact
	reporters?: Array<Reporter>
}

const defaultReporters = [new Basic()]

/**
 * Core sola class
 * @example
 * ```ts
 * const sola = new Sola({ tag: 'my-app' })
 *
 * sola.log('hello sola') // <- my-app hello sola
 *
 * const customTag = sola.withTag('mytag')
 *
 * customTag.log('hello sola') // <- my-app:mytag hello sola
 * ```
 */
export class Sola {
	tag: string
	parent?: Sola
	level?: LogLevel
	reporters: Array<Reporter>
	redact: Redact

	constructor(args?: SolaArgs) {
		const { tag = '', parent, redact, level, reporters = defaultReporters } = args ?? {}

		this.level = level
		this.tag = tag
		this.parent = parent
		this.reporters = reporters
		this.redact = redact ?? parent?.redact ?? []
	}

	#logType(type: LogType, args: Array<unknown>) {
		const level = this.getLevel()
		const { reporters, tag } = this

		if (level >= LogTypes[type]) {
			for (const reporter of reporters) {
				reporter.log({
					tag,
					time: new Date(),
					type,
					args: redact(this.redact, args),
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

function redact(paths: Array<RedactPath>, args: Array<unknown>) {
	const updates = [...args]
	for (const path of paths) {
		for (let index = 0; index < args.length; index++) {
			const arg = args[index]
			updates[index] = redactIn(path, arg)
		}
	}

	return updates
}

function redactIn(path: RedactPath, arg: unknown) {
	if (typeof arg === 'object' && arg) {
		let current = arg

		for (let index = 0; index < path.length; index++) {
			const property = path[index]
			if (property && property in current) {
				// le'ts make a copy so logged objects are not affected
				current = { ...current }
				const isLast = index === path.length - 1

				if (isLast) {
					// @ts-expect-error can't index current with property
					current[property] = '****'
				}
				else {
					// @ts-expect-error can't index current with property
					current = current[property]
				}
			}
		}

		return current
	}

	return arg
}
