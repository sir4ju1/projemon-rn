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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
  },
  workCount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  workCountText: {    
    fontSize: 14,
    color: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'skyblue'

  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }
})

export default ({ item, onPress, onOpen, onClose }) => (
  <Swipeable
    leftContent={(
      <Text>Pull to activate</Text>
    )} 
    rightButtons={[
      <TouchableHighlight
        underlayColor='yellow'
        onPress={onPress}
        style={[style.rightSwipeButton, { backgroundColor: 'lightyellow' }]}>
        <Icon
          name='playlist-play'
          size={28}
          color='black'
        />
      </TouchableHighlight>,
      <TouchableHighlight 
        underlayColor='green'
        style={[style.rightSwipeButton, { backgroundColor: 'lightgreen' }]}>
        <Icon
          name="playlist-add-check"
          size={28}
          color='white'
        />
      </TouchableHighlight>,
    ]}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
    >
    <View style={style.view}>
      <View style={{ flex:1, flexDirection: 'row' }}>
        <Text style={style.title}>
          {item.name}
        </Text>
        <View style={style.workCount}>
          <Text style={style.workCountText}>
            {item.workCount}
          </Text>
        </View>
      </View>
      <Text>
        {item.description}
      </Text>
    </View>
  </Swipeable>

)
