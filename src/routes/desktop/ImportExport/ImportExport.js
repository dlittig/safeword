import React from 'react'

import AppBar from '../../../components/desktop/AppBar'
import ImportExportComponent from '../../../components/desktop/ImportExport'

const ImportExport = () => (
  <AppBar
    withGrid
    backButton
    name="Import & Export"
  >
    <ImportExportComponent />
  </AppBar>
)

export default ImportExport
