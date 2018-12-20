import React from 'react'

import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { ListItem, View, Left, Right, Radio, Text, Button } from 'native-base'
import { Setup as SetupAction } from '../../../../../store/actions/Setup'
import NavigationService from '../../../../../service/native/NavigationService'
import fs from '../../../../../modules/filesystem'
import globals from '../../../../../globals'

const styles = StyleSheet.create({
  text: {
    marginVertical: 16
  }
})

class OpenPgp extends React.Component {

  /**
   * Opens filepicker to select destination directory for key files
   */
  onOpenFilePicker = () => {
    // Pass callback so we can react on selection of dir in this component
    NavigationService.navigate('FilePicker', {onSelect: this.onFilePickerClose})
  }

  /**
   * Delegates the selected filepath to the parent component
   * @param {String} filePath Selected filepath by user
   */
  onFilePickerClose = filePath => this.props.handleAdditional('filePath', filePath)

  render() {
    return (
      <View>
        <Text style={styles.text}>Key files directory*</Text>

        <Button block light onPress={this.onOpenFilePicker}>
          <Text>Select directory</Text>
        </Button>
      </View>
    )
  }
}

export default connect()(OpenPgp)
