export default class VNode {
    tag: string
    data: any
    children: Array<VNode>
    text: string
    constructor(tag: string, data: any, children:Array<VNode>, text?: string) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
    }
}