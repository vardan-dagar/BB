const Book = require('../models/Book');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Tracking = require('../models/Tracking');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const { location, action } = req.query;
    let query = {};
    
    if (location && location !== 'all') query.location = location;
    if (action) query.action = action;
    
    const books = await Book.find(query)
      .populate('owner', 'username location')
      .sort({ createdAt: -1 });
      
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all unique locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Book.distinct('location');
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, location, action, condition, details } = req.body;
    
    const book = await Book.create({
      title,
      owner: req.user.id,
      location,
      action,
      condition,
      details
    });
    
    // Add to user's shared books
    await User.findByIdAndUpdate(req.user.id, {
      $push: { booksShared: book._id }
    });
    
    // Create notification
    await Notification.create({
      user: req.user.id,
      message: `New ${action} request for "${title}" added!`,
      type: 'book',
      relatedId: book._id
    });
    
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request to borrow a book
exports.requestBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot request your own book' });
    }
    
    if (book.status !== 'available') {
      return res.status(400).json({ message: 'Book is not available' });
    }
    
    // Update book status
    book.status = 'requested';
    book.requestedBy = req.user.id;
    await book.save();
    
    // Create tracking record
    const tracking = await Tracking.create({
      book: book._id,
      borrower: req.user.id,
      lender: book.owner,
      status: 'pending'
    });
    
    // Create notification for owner
    const owner = await User.findById(book.owner);
    await Notification.create({
      user: book.owner,
      message: `New request for your book "${book.title}"!`,
      type: 'book',
      relatedId: book._id
    });
    
    res.status(200).json({ book, tracking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};