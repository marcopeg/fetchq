
const {
    createCharactersResolver,
    createCharacterResolver,
    createCreateCharacterMutation,
} = require('./resolvers/characters.resolver')

const createResolver = () => ({
    hello: () => 'Hello world!',
    foo: () => 123,
    faa: () => [ 'hello', 'world' ],
    characters: createCharactersResolver(),
    character: createCharacterResolver(),
    createCharacter: createCreateCharacterMutation(),
})

module.exports = {
    createResolver,
}
