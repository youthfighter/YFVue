import YFVue from './YFVue/index'
const myVue: any = new YFVue({
    data: function () {
        return {
            a: {
                b: 1
            },
            b: ''
        }
    },
    render(h) {
        console.log('render', this)
        return h('p', { id: '123' }, [
            h(undefined, undefined, undefined, this.a.b)
        ])
    },
    created() {
        console.log('created', this)
        this.helloWorld()
    },
    methods: {
        helloWorld() {
            console.log('hello')
        }
    },
    watch: {
        'a.b': function (oldVal: any, newVal: any) {
            console.log('--------watch a.b-------', oldVal, newVal)
        },
        'a': function (oldVal: any, newVal: any) {
            console.log('--------watch a-------', oldVal, newVal)
        }
    }
})
console.log('---mount---')
myVue.$mount('#app')

//myVue._data.a = new Date().toString()
console.log(myVue)

setInterval(() => {
    myVue.a.b = new Date().toString()
}, 1000)