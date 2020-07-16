export function query(el: string | Element): Element {
    let result: any = typeof el === 'string' ? document.querySelector(el) : el
    return result ? result : document.createElement('div')
}