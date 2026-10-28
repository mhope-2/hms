const merge = require('deepmerge')

describe('deepmerge security hardening', () => {
  it('does not write prototype-control keys into the returned object or Object.prototype', () => {
    const source = JSON.parse('{"__proto__":{"polluted":true},"safe":{"value":1}}')
    const result = merge({}, source)

    expect(({} as { polluted?: boolean }).polluted).toBeUndefined()
    expect(result.safe.value).toBe(1)
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)
  })
})
