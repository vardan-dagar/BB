const Tracking = require('../models/Tracking');
const Book = require('../models/Book');
const Notification = require('../models/Notification');

// Get all trackings for a user
exports.getUserTrackings = async (req, res) => {
  try {
    const trackings = await Tracking.find({
      $or: [{ borrower: req.user.id }, { lender: req.user.id }]
    })
    .populate('book', 'title')
    .populate('borrower lender', 'username')
    .sort({ createdAt: -1 });
    
    res.status(200).json(trackings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trackings by status
exports.getTrackingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = [
      'pending', 'shipped', 'delivered', 
      'return-requested', 'return-in-progress', 
      'return-completed', 'return-delayed'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const trackings = await Tracking.find({
      $or: [{ borrower: req.user.id }, { lender: req.user.id }],
      status
    })
    .populate('book', 'title')
    .populate('borrower lender', 'username')
    .sort({ createdAt: -1 });
    
    res.status(200).json(trackings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tracking status
exports.updateTrackingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const tracking = await Tracking.findById(id);
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking not found' });
    }
    
    // Check if user is involved in this tracking
    if (tracking.borrower.toString() !== req.user.id && 
        tracking.lender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update tracking
    tracking.status = status;
    tracking.updates.push({ status, notes });
    
    // Update days left based on status
    if (status === 'shipped') tracking.daysLeft = 7;
    if (status === 'delivered') tracking.daysLeft = 0;
    
    await tracking.save();
    
    // Update book status if needed
    if (status === 'delivered') {
      await Book.findByIdAndUpdate(tracking.book, {
        status: 'borrowed',
        currentHolder: tracking.borrower
      });
    }
    
    // Create notification for the other party
    const notifyUserId = tracking.borrower.toString() === req.user.id 
      ? tracking.lender 
      : tracking.borrower;
    
    await Notification.create({
      user: notifyUserId,
      message: `Status updated to "${status}" for book tracking`,
      type: 'tracking',
      relatedId: tracking._id
    });
    
    res.status(200).json(tracking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};