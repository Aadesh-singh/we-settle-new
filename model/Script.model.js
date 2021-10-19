const mongoose = require('mongoose');

const ScriptSchema = new mongoose.Schema({
  header: String,
  footer: String,
});

const Script = mongoose.model('Script', ScriptSchema);

module.exports = Script;
