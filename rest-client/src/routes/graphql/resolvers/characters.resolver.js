
const data = [
    {
        id: 1,
        name: 'Marco',
        age: 37,
    },
    {
        id: 2,
        name: 'Lia',
        age: 29,
    },
    {
        id: 3,
        name: 'Angela',
        age: 23,
    },
]

const createCharactersResolver = () => ({ search }) => new Promise((resolve) => {
    setTimeout(() => resolve(data.filter((item) => {
        if (!search) {
            return true
        }
        return (
            false
            || item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            || item.age.toString() === search
        )
    })))
})

const createCharacterResolver = () => ({ id }, b, c) => new Promise((resolve, reject) => {
    resolve(data.find(i => i.id === id))
})

const createCreateCharacterMutation = () => (fields) => new Promise((resolve, reject) => {
    const duplicate = data.find(i => i.name.toLowerCase() === fields.name.toLowerCase())
    if (duplicate) {
        return reject('duplicate name')
    }

    const newId = data
        .map(i => i.id)
        .reduce((a, b) => a + b, 0)
    const item = {
        ...fields,
        id: newId,
    }
    data.push(item)
    resolve(item)
})

module.exports = {
    createCharactersResolver,
    createCharacterResolver,
    createCreateCharacterMutation,
}
