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
    width: 10,
    marginRight: 10
  },
  task: {
    backgroundColor: 'skyblue',
    width: 10,
    marginRight: 20
  },
  bug: {
    backgroundColor: 'red',
    width: 10,
    marginRight: 20
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }

})

export default ({ item, type, onPress, onOpen, onClose  }) =>  (
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
      </TouchableHighlight>
    ]}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
  
  >
    <View style={[style.view, { backgroundColor: type === 'section' ? 'white' : '#eee' }]}>
      {
        item.type === 'Task'  ?
          <View style={style.task} />  :
          item.type === 'Bug'  ?
            <View style={style.bug} /> :
            <View style={style.backlog} /> 
      }
     

      <View style={{ paddingRight: 10, paddingVertical: 10 }}>
        <Text style={style.title}>
          {item.title}
        </Text>
      </View>
    </View>
  </Swipeable>
)
