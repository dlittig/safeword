import React from 'react'

import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { View, Fab, Icon, Container, Content } from 'native-base'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import Group from '../../../components/native/Group'
import { theme } from '../../../theme/theme.native'
import EditGroup from '../../../components/native/EditGroup'
import GroupModel from '../../../model/Group'
import EmptyState from '../../../components/native/EmptyState'
import { saveGroup } from '../../../components/core/Group'

const styles = StyleSheet.create({
  coloredBackground: {
    backgroundColor: theme.palette.primary.light
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  /*
  content: {
    marginHorizontal: 10,
    marginVertical: 5
  },
  */
  fab: {
    backgroundColor: theme.palette.secondary.main
  },
  group: {
    marginHorizontal: 10,
    marginVertical: 5
  }
})

class ManageGroups extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Manage groups',
    drawerIcon: ({ tintColor }) => (
      <Icon
        name="bookmark"
        size={20}
      />
    ),
    title: 'Groups'
  }

  state = {
    editGroupOpen: false
  }

  /**
   * Handles edit close event
   */
  handleClose = prop => event => {
    if(prop !== 'close') {
      const result = saveGroup(new GroupModel(new Date().getTime(), prop), 'name')
      if(result === true) {
        this.setState({editGroupOpen: false})
      }
    } else {
      this.setState({editGroupOpen: false})
    }
  }

  render() {
    const { groups } = this.props

    return (
      <InfoAwareRouteComponent style={styles.coloredBackground}>
        <Container style={styles.container}>
          <Content style={styles.content}>
            {groups.map((item, index) => (
              <View key={index} style={styles.group}>
                <Group model={item} name={item.name} />
              </View>
            ))}

            {(groups.length === 0) && (
              <EmptyState text="No groups saved so far. Create a few with the plus button." />
            )}

            <EditGroup
              open={this.state.editGroupOpen}
              handleClose={this.handleClose}
              title="New group"
            />
          </Content>

          <Fab
            active={this.state.editGroupOpen}
            direction="up"
            style={styles.fab}
            position="bottomRight"
            onPress={() => this.setState({ editGroupOpen: !this.state.editGroupOpen })}
          >
            <Icon name="add" />
          </Fab>
        </Container>
      </InfoAwareRouteComponent>
    )
  }
}

const mapStateToProps = ({persistence: {groups, adapter}}) => ({groups, adapter})

export default connect(mapStateToProps)(ManageGroups)
