
const {
    createCharactersResolver,
    createCharacterResolver,
} = require('./resolvers/characters.resolver')

const createResolver = () => ({
    hello: () => 'Hello world!',
    foo: () => 123,
    faa: () => [ 'hello', 'world' ],
    characters: createCharactersResolver(),
    character: createCharacterResolver(),
})

module.exports = {
    createResolver,
}
