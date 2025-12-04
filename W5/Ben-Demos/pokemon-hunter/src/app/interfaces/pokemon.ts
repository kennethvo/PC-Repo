export interface Pokemon {
    id:number
    name:string
    sprite:string
    types?:object[] //The ? means it's optional - it might be too much work
}
