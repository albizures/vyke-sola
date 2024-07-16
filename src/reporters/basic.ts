/* eslint-disable no-console */
import type { LogData, Reporter } from './reporter.js'

export class Basic implements Reporter {
	log(data: LogData) {
		const { type, tag, args } = data

		// in case there is a tag, we prepend it to the args
		const params = tag ? [tag, ...args] : args
		if (type in console) {
			// @ts-expect-error type can't index console
			console[type](...params)
		}
		else {
			console.log(...params)
		}
	}
}
