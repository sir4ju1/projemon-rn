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
    backgroundColor: '#ddd',
    width: 5,
    marginRight: 7
  },
  task: {
    backgroundColor: 'skyblue',
    width: 5,
    marginRight: 12
  },
  bug: {
    backgroundColor: '#f55',
    width: 5,
    marginRight: 12
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }

})

export default ({ item, type, onActivate, onClosePress, onOpen, onClose  }) =>  (
  <Swipeable
    leftActionActivationDistance={120}
    leftContent={(
      <View style={{
        flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20,
        backgroundColor: item.type === 'Task' ? 'skyblue' : item.type === 'Bug' ? '#f55' : '#ddd' }} >
        <Icon
          name="alarm-on"
          size={28}
          color='white'
        />
      </View>
    )} 
    rightButtons={[
      <TouchableHighlight
        underlayColor='green'
        onPress={onClosePress}
        style={[style.rightSwipeButton, { backgroundColor: '#5f5' }]}>
        <Icon
          name='done'
          size={28}
          color='white'
        />
      </TouchableHighlight>
    ]}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
    onLeftActionComplete={onActivate}
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
        <Text>
          {item.iteration}
        </Text>
        <Text style={{ color: item.state === 'New' ? '#5f5' : '#55f' }}>
          {item.state}
        </Text>
      </View>
    </View>
  </Swipeable>
)
