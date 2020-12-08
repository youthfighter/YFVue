import YFVue from '../src/index'

let vm = new YFVue({
    el: '#app',
    data() {
        return {
            abc: '123',
            haha: {
                date: null
            }
        }
    },
    render(h) {
        return h(undefined, undefined, undefined, this.haha.date)
    }
})

document.addEventListener('click', () => {
    vm.haha.date = new Date().toString()
})

console.log(vm)