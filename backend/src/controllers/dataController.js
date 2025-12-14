const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');

const DATA_FILE = path.join(__dirname, '../data/dummy.json');

// Load data from file
const loadData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

// Save data to file
const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// GET /api/v1/data/sample
exports.getSample = (req, res) => {
  try {
    const data = loadData();
    res.json({
      status: 'success',
      count: data.length,
      data: data.slice(0, 10) // Return first 10 as sample
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// POST /api/v1/data/import
const upload = multer({ dest: 'uploads/' });

exports.importData = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (req.file) {
        // Handle CSV file upload
        const results = [];
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            saveData(results);
            fs.unlinkSync(req.file.path); // Clean up uploaded file
            res.json({
              status: 'success',
              imported: results.length
            });
          });
      } else if (req.body.data) {
        // Handle JSON data
        const data = Array.isArray(req.body.data) ? req.body.data : [req.body.data];
        saveData(data);
        res.json({
          status: 'success',
          imported: data.length
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'No data provided'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
];

// GET /api/v1/records
exports.getRecords = (req, res) => {
  try {
    const { start, end, module, limit = 100, offset = 0 } = req.query;
    let data = loadData();

    // Apply filters
    if (start) {
      data = data.filter(r => new Date(r.date) >= new Date(start));
    }
    if (end) {
      data = data.filter(r => new Date(r.date) <= new Date(end));
    }
    if (module) {
      data = data.filter(r => r.module === module);
    }

    // Pagination
    const total = data.length;
    const paginatedData = data.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      status: 'success',
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      data: paginatedData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
