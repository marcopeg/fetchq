
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
        id: 2,
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

module.exports = {
    createCharactersResolver,
    createCharacterResolver,
}
