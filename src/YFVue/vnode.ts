export default class VNode {
    tag: string
    data: any
    children: Array<VNode>
    text: string
    key: any
    elm: any
    constructor(tag: string, data: any, children: Array<VNode>, text?: string, key?: any) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.key = key
    }
}