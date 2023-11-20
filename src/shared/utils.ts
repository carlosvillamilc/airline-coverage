export function checkUUID(id:string):boolean{
    let pattern = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    let result = id.match(pattern) ? true : false;
    return result;
}