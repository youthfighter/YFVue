import YFVue from './YFVue/index'

console.log(YFVue)
const myVue = new YFVue({
    data: function () {
        return {
            a: {
                b: 1
            },
            b:1
        }
    },
    render(h) {
        console.log('hhh', this)
        return h('div', {}, [
            h('h1', {}, this.a.b)
        ])
    },
    created() {
        console.log(this)
        setInterval(() => {
            const curDate = new Date().toString()
            this.b = curDate
            console.log(document.querySelector('h1').innerHTML, curDate)
        }, 2000)
    },
    methods: {
        count() {
            this.a++
        }
    }
})
myVue.$mount('#app')
console.log(myVue)