
const fetchqInfo = () => async (req, res) =>
    res.send(await req.fetchq.info())

module.exports = {
    fetchqInfo,
}
