import YFVue from '../src/YFVue/index'

test('data proxy', () => {
  const vm: any = new YFVue({
    data: function () {
      return {
        a: 123
      }
    }
  })
  expect(vm.a).toBe(123);
});

test('watch data change', () => {
  const vm: any = new YFVue({
    data: function () {
      return {
        a: 123
      }
    }
  })
  vm.$watch('a', (pre, val) => {
    expect(pre).toBe(123);
    expect(val).toBe(456);
    expect(vm.a).toBe(456);
  })
  vm.a = 456
});

test('methods called', () => {
  const vm: any = new YFVue({
    methods: {
      sayHello() {
        return this
      }
    }
  })
  let result = vm.sayHello()
  expect(result).toBe(vm)
})

test('lifecycle: execute created', () => {
  const createdCb = jest.fn()
  const mountedCb = jest.fn()
  const vm: any = new YFVue({
    created() {
      createdCb()
    },
    mounted() {
      mountedCb()
    }
  })
  expect(createdCb).toBeCalled();
  expect(mountedCb).not.toBeCalled();
  vm.$mount('#app')
  expect(mountedCb).toBeCalled();
})


test.only('event execute', () => {
  const clickCb = jest.fn()
  const vm = new YFVue({
    render: (h) => {
      return h('div', {}, [
        h('button', {
          id: 'btn',
          on:{
            'click': clickCb,
          }
        }, 'hello yfvue')
      ])
    }
  })
  vm.$mount('#app')
  document.body.appendChild(vm.$el)
  const btn: any = document.querySelector('#btn')
  expect(btn.tagName).toEqual('BUTTON')
  btn.click()
  expect(clickCb).toHaveBeenCalled()
})