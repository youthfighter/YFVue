import YFVue from '../src/YFVue/index'

/**
 * 访问vm._data.a 与 vm.a一致
 */
test('data proxy', () => {
  const vm: any = new YFVue({
    data: function () {
      return {
        a: 123
      }
    }
  })
  expect(vm._data.a).toBe(123)
})