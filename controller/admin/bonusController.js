const Bonus = require('../../model/Bonus');

exports.getBonuses = async (req, res) => {
    try {
        const bonuses = await Bonus.find();
        res.status(200).json(bonuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};