const isCamposValidos = (...campos) => {
    for(let campo of campos){
        if(!campo){
            return false
        }
    }
    return true
}

module.exports = { isCamposValidos }