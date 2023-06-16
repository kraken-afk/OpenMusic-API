import { importParse } from '../src/libs/TypeScriptParser'

describe('TypeScript parser using TypeScript API test case', () => {
  it('Should able to import module from helpers/module.ts', async () => {
    const modules = await importParse('Spec/helpers/module.ts')

    expect(modules).toBeInstanceOf(Object)
    expect(modules.name).toBe('Romeo')
    expect(modules.age).toBe(18)
    expect(typeof modules.sayHello).toBe('function')
  })
})
