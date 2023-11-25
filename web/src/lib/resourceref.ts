export default class ResourceRef{
    private static names: string[]=[]

    constructor(private name: string, private index: number){

    }

    getIndex(){
        return this.index
    }

    getFullName(){
        return `${this.getPrefixWithIndex()}: ${this.name}`
    }

    getPrefixWithIndex(){
        return `Abbildung ${this.getIndex()}`
    }

    static getResourceRef(name: string){
        let index = ResourceRef.names.findIndex((s)=>s==name);
        let returnVal;
        if(index == -1){
            ResourceRef.names.push(name);
            returnVal = ResourceRef.names.length - 1
        }else{
            returnVal = index;
        }
        return new ResourceRef(name,returnVal + 1);
    }
}