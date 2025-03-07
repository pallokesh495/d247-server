import Affiliate from '../../model/admin/Affiliate.js'

const AffiliateController = {
    // List all affiliates
    listAffiliates: async (req, res) => {
        try {
            const affiliates = await Affiliate.findAll();
            res.status(200).json({ success: true, data: affiliates });
        } catch (error) {
            console.error('Error in listAffiliates:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update the friends field for a specific affiliate
    updateFriends: async (req, res) => {
        try {
            const { uid } = req.params; // Extract uid from URL params
           

            // Find the affiliate by uid
            const affiliate = await Affiliate.findOne({ where: { uid } });
            if (!affiliate) {
                return res.status(404).json({ success: false, error: 'Affiliate not found' });
            }

            // Increment the friends field
            affiliate.friends +=  1; // Default increment by 1 
            await affiliate.save();

            res.status(200).json({ success: true, data: affiliate });
        } catch (error) {
            console.error('Error in updateFriends:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default AffiliateController;