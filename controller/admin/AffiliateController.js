const Affiliate = require('../../model/Affiliate');

exports.getAffiliates = async (req, res) => {
    try {
        const affiliates = await Affiliate.find();
        res.status(200).json(affiliates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};