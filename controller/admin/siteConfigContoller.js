const SiteConfig = require('../../model/SiteConfig');

exports.getConfig = async (req, res) => {
    try {
        const config = await SiteConfig.findOne();
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const updatedConfig = await SiteConfig.findOneAndUpdate({}, req.body, { new: true });
        res.status(200).json(updatedConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};