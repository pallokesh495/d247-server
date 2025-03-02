const OwnerVerification = require('../../model/OwnerVerification');

exports.getOwnersVerification = async (req, res) => {
    try {
        const verifications = await OwnerVerification.find();
        res.status(200).json(verifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVerificationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVerification = await OwnerVerification.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedVerification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};