import ImportExportAdapter from './ImportExportAdapter'

export default class CsvAdapter extends ImportExportAdapter {

  /**
   * Describes adapter by returning an identifier
   * @returns description
   */
  describe = () => 'CSV'

  /**
   * exports all data to a certain type
   * @param  {Object} options
   */
  export = (options) => {}

  /**
   * Imports all data of a certain type
   * @param  {Object} options
   */
  import = (options) => {}
}
