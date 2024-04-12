import type { LogType } from '../log.js'

export type LogData = {
	type: LogType
	tag: string
	time: Date
	args: Array<unknown>
}

export type Reporter = {
	log: (data: LogData) => void
}
