// controllers/protectedController.js

export const getDashboard = (req, res) => {
  res.status(200).json({
    message: "You have accessed a protected dashboard route.",
    user: req.user,
  });
};
