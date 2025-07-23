// controllers/dashboardController.js

export const getDashboard = (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, user ID: ${req.user.id}`,
    user: req.user,
  });
};
