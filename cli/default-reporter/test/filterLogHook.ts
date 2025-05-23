import { type Log } from '@pnpm/core-loggers'
import { toOutput$ } from '@pnpm/default-reporter'
import { logger, createStreamParser } from '@pnpm/logger'
import { firstValueFrom } from 'rxjs'

test('logger with filterLog hook', async () => {
  const output$ = toOutput$({
    context: {
      argv: ['install'],
      config: {
        hooks: {
          filterLog: [(log: Log) => {
            if (log.level === 'debug') {
              return false
            }
            if (log.level === 'warn') {
              if (log.message === 'aaa') {
                return false
              }
              if (log.prefix === '/tmp') {
                return false
              }
            }
            return true
          }],
        },
      } as any, // eslint-disable-line
    },
    streamParser: createStreamParser(),
  })

  // debug level is filtered out
  logger.debug({
    message: 'debug message',
  })
  // message equals to 'aaa' is filtered out
  logger.warn({
    message: 'aaa',
    prefix: '/root',
  })
  logger.warn({
    message: 'bbb',
    prefix: '/root',
  })
  // prefix equals to '/tmp' is filtered out
  logger.warn({
    message: 'ccc',
    prefix: '/tmp',
  })

  expect.assertions(1)

  const msg = await firstValueFrom(output$)
  expect(msg).toEqual(expect.stringContaining('bbb'))
})
