const Game = require('../../model/Game');

exports.getGameHistory = async (req, res) => {
    try {
        const history = await Game.find();
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGame = async (req, res) => {
    try {
        const newGame = new Game(req.body);
        await newGame.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};