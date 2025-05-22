import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.find(id);
    if (!user) {
      throw new Error(`User with such '${user}' not found`);
    }
    req.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
