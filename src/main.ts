import YFVue from './YFVue/index'
const myVue: any = new YFVue({
    data: function () {
        return {
            a: {
                b: new Date().toString()
            },
            b: '',
            firstName: 'zhang',
            lastName: 'san'
        }
    },
    render(h) {
        console.log('render', this)
        return h('p', { attrs: { id: 'abc' }, on: { click: this.resetTime } }, [
            h(undefined, undefined, undefined, this.name)
        ])
        // return h(undefined, undefined, undefined, this.name)

    },
    computed: {
        name() {
            return this.firstName + this.lastName + '--' + this.a.b
        }
    },
    watch: {
        'a.b': function (oldVal: any, newVal: any) {
            console.log('--------watch a.b-------', oldVal, newVal)
        },
        'a': function (oldVal: any, newVal: any) {
            console.log('--------watch a-------', oldVal, newVal)
        }
    },
    created() {
        console.log('created', this)
        this.helloWorld()
        // setInterval(this.resetTime, 10000)
    },
    methods: {
        helloWorld() {
            console.log('hello')
        },
        resetTime() {
            this.a.b = new Date().toString()
            console.log('resetTime', document.querySelector('#abc'))
        }
    }
})
console.log('---mount---')
myVue.$mount('#app')