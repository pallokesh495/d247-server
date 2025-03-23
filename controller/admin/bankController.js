import Bank from '../../model/admin/Bank.js'; // Adjust the path as needed
import sequelize from '../../config/db.js'; // Adjust the path as needed

const BankController = {
    // Get bank details by bank_id
    getBankDetails: async (req, res) => {
        try {
            // const { bank_id } = req.params;
            const bank_id =1;

            // Find the bank by bank_id
            const bank = await Bank.findOne({
                where: { bank_id },
            });

            if (!bank) {
                return res.status(404).json({ success: false, error: 'Bank not found' });
            }

            res.status(200).json({ success: true, data: bank });
        } catch (error) {
            console.error('Error in getBankDetails:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update all fields of a bank
    updateBankDetails: async (req, res) => {
        try {
          const { bank_id } = req.params;
          const {
            bank_name,
            account_name,
            account_number,
            ifsc,
            upi_id,
            BEP20,
            TRC20,
            ERC20,
            exchange_rate,
          } = req.body;
      
          // Check if bank_id is provided
          if (!bank_id) {
            // If no bank_id is provided, create a new bank
            const newBank = await Bank.create({
              bank_name,
              account_name,
              account_number,
              ifsc,
              upi_id,
              BEP20,
              TRC20,
              ERC20,
              exchange_rate,
            });
      
            return res.status(201).json({ success: true, data: newBank });
          }
      
          // Find the bank by bank_id
          const bank = await Bank.findOne({
            where: { bank_id },
          });
      
          if (!bank) {
            // If bank is not found, create a new bank
            const newBank = await Bank.create({
              bank_name,
              account_name,
              account_number,
              ifsc,
              upi_id,
              BEP20,
              TRC20,
              ERC20,
              exchange_rate,
            });
      
            return res.status(201).json({ success: true, data: newBank });
          }
      
          // If bank exists, update all fields
          await bank.update({
            bank_name,
            account_name,
            account_number,
            ifsc,
            upi_id,
            BEP20,
            TRC20,
            ERC20,
            exchange_rate,
          });
      
          res.status(200).json({ success: true, data: bank });
        } catch (error) {
          console.error('Error in updateBankDetails:', error);
          res.status(500).json({ success: false, error: error.message });
        }
      },

    // Update only the exchange rate
    updateExchangeRate: async (req, res) => {
        try {
            const { bank_id } = req.params;
            const { exchange_rate } = req.body;

            // Find the bank by bank_id
            const bank = await Bank.findOne({
                where: { bank_id },
            });

            if (!bank) {
                return res.status(404).json({ success: false, error: 'Bank not found' });
            }

            // Update only the exchange rate
            await bank.update({ exchange_rate });

            res.status(200).json({ success: true, data: bank });
        } catch (error) {
            console.error('Error in updateExchangeRate:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Create a new bank
    createBank: async (req, res) => {
        try {
            const {
                bank_name,
                account_name,
                account_number,
                ifsc,
                upi_id,
                BEP20,
                TRC20,
                ERC20,
                exchange_rate,
            } = req.body;

            // Create a new bank record
            const newBank = await Bank.create({
                bank_name,
                account_name,
                account_number,
                ifsc,
                upi_id,
                BEP20,
                TRC20,
                ERC20,
                exchange_rate,
            });

            res.status(201).json({ success: true, data: newBank });
        } catch (error) {
            console.error('Error in createBank:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Delete a bank by bank_id
    deleteBank: async (req, res) => {
        try {
            const { bank_id } = req.params;

            // Find the bank by bank_id
            const bank = await Bank.findOne({
                where: { bank_id },
            });

            if (!bank) {
                return res.status(404).json({ success: false, error: 'Bank not found' });
            }

            // Delete the bank
            await bank.destroy();

            res.status(200).json({ success: true, message: 'Bank deleted successfully' });
        } catch (error) {
            console.error('Error in deleteBank:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default BankController;