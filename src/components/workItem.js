import React from 'react'
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Swipeable from 'react-native-swipeable'
import Icon from 'react-native-vector-icons/MaterialIcons'

const style = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',   
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 15
  },
  backlog: {
    backgroundColor: 'yellow',
    width: 5,
    marginRight: 10
  },
  task: {
    backgroundColor: 'skyblue',
    width: 10,
    marginRight: 15
  },
  bug: {
    backgroundColor: 'red',
    width: 10,
    marginRight: 15
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }

})

export default ({ item, onPress, onOpen, onClose  }) =>  (
  <Swipeable
    leftContent={(
      <Text>Done</Text>
    )} 
    rightButtons={[
      <TouchableHighlight
        underlayColor='green'
        onPress={onPress}
        style={[style.rightSwipeButton, { backgroundColor: 'lightgreen' }]}>
        <Icon
          name='done'
          size={28}
          color='black'
        />
      </TouchableHighlight>,
      <TouchableHighlight 
        underlayColor='blue'
        style={[style.rightSwipeButton, { backgroundColor: 'lightblue' }]}>
        <Icon
          name="info-outline"
          size={28}
          color='white'
        />
      </TouchableHighlight>,
    ]}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
  
  >
    <View style={style.view}>
      {
        item.fields['System.WorkItemType'] ==='Task'  ?
          <View style={style.task} />  :
          item.fields['System.WorkItemType'] ==='Bug'  ?
            <View style={style.bug} /> :
            <View style={style.backlog} /> 
      }
     

      <View style={{ paddingRight: 10, paddingVertical: 10 }}>
        <Text style={style.title}>
          {item.fields['System.Title']}
        </Text>
        <Text style={{fontSize: 12 }}>
          {item.fields['System.State']}
        </Text>
      </View>
    </View>
  </Swipeable>
)
