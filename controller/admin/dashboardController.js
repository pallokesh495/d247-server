import { Dashboard } from '../models/index.js';

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      // Fetch the latest dashboard data
      const dashboardData = await Dashboard.findOne({
        order: [['createdAt', 'DESC']], // Get the most recent entry
      });

      if (!dashboardData) {
        return res.status(404).json({ message: 'No dashboard data found' });
      }

      res.json({
        totalUsers: dashboardData.totalUsers,
        revenue: dashboardData.revenue,
        activeProjects: dashboardData.activeProjects,
        customerSatisfaction: dashboardData.customerSatisfaction,
        tasksCompleted: dashboardData.tasksCompleted,
        teamPerformance: dashboardData.teamPerformance,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
};

export default dashboardController;