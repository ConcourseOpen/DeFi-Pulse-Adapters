const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const CSV = {
  create: ({ output, slug }) => {

    const fields = CSV.getDefaultFields();
    const entries = [];

    // Loop through each item in the time series
    output.map((item) => {
      let record = {};

      // Loop through each available asset
      Object.keys(item.output).map((asset) => {
        if(
          fields.filter((field) => field.id === asset).length === 0
        ){
          // Add new field
          fields.push({
            id: asset, title: asset,
          });
        }
      });

      // Create new record
      record = item.output;
      record.timestamp = item.timestamp;
      record.block = item.block;
      entries.push(record);

    });

    // Buidl CSV
    const csvWriter = createCsvWriter({
      path: `csv/${slug}-${CSV.getDate()}.csv`,
      header: fields,
    });

    csvWriter.writeRecords(entries)
    .then(() => {
      CSV.notify();
    });
  },
  getDate: () => (
    new Date().toTimeString()
  ),
  getDefaultFields: () => (
    [
      { id: 'timestamp', title: 'timestamp' },
      { id: 'block', title: 'block' },
    ]
  ),
  notify: () => (
    console.log('** Verification CSV has been generated and is ready for your review in the /csv folder. **')
  )
}


module.exports = CSV;
