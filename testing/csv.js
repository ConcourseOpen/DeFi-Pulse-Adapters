const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const CSV = {
  // Core function to create a CSV
  create: async ({ output, slug }) => {

    const fields = CSV.getDefaultFields();
    const entries = [];

    // Loop through each item in the time series
    await Promise.all(output.map(
      async (item, index) => {
        let record = {};

        // Loop through each available asset
        Object.keys(item.output).map((asset) => {
          if(
            fields.filter((field) => field.id === asset).length === 0
          ){
            // Add new field
            fields.push(
              { // Balance
                id: asset,
                title: asset,
              },
              /**{ // Price
                id: `${asset}-price`,
                title: `${asset}-price`,
              }**/
            );
          }

        });

        // Create new record
        record = item.output;

        // Metadata
        record.timestamp = item.timestamp;
        record.date = CSV.timestampToDate(item.timestamp);
        record.block = item.block;

        // Get prices
        /**await Promise.all(
          Object.keys(item.output).map( async (token, i) => {
            await CSV.sleep(750 * i);

            // Exit if placeholder field
            if(
              CSV.getDefaultFields().filter((field) => field.id === token).length !== 0
            ) return;

            const { data } = await CSV.getPrice({symbol: token, timestamp: item.timestamp});
            record[`${token}-price`] = data.ticker;
          })
        )**/

        entries.push(record);

      }
    ))

    // Buidl CSV
    const csvWriter = createCsvWriter({
      path: `csv/${slug}-${CSV.getDate()}.csv`,
      header: fields,
    });

    csvWriter.writeRecords(
      CSV.sortEntries(entries)
    )
    .then(() => CSV.notify());
  },
  // Get a basic date object
  getDate: () => (
    new Date()
  ),
  sortEntries: (entries) => (
    entries.sort((a, b) => parseFloat(b.block) - parseFloat(a.block))
  ),
  // Convert a timestamp to a unix date
  timestampToDate: (timestamp) => (
    new Date(
      parseFloat(timestamp) * 1000
    )
  ),
  // Get default left side fields
  getDefaultFields: () => (
    [
      { id: 'timestamp', title: 'timestamp' },
      { id: 'date', title: 'date' },
      { id: 'block', title: 'block' },
    ]
  ),
  sleep: (time) => (
    new Promise((resolve) => setTimeout(resolve, time))
  ),
  // Send a notification to the user
  notify: () => (
    console.log('** Verification CSV has been generated and is ready for your review in the /csv folder. **')
  ),
  // Get a historical price given a price and timestamp
  getPrice: ({ symbol, timestamp }) => {
    let url = `${process.env.DEFIPULSE_API_URL}/${process.env.DEFIPULSE_KEY}/price/ticker`;
    const req = {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        symbol,
        timestamp,
      },
    };
    return axios(req);
  }
}


module.exports = CSV;
