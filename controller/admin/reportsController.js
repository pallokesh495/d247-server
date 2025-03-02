const OwnerReport = require('../../model/OwnerReport');

exports.getOwnerReports = async (req, res) => {
    try {
        const reports = await OwnerReport.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOwnerReport = async (req, res) => {
    try {
        const newReport = new OwnerReport(req.body);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};