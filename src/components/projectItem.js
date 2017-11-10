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
    flexDirection: 'row'
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
    borderRadius: 10
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }
})

export default ({ item, onPress, onOpen, onClose, onPullLeft, onCloseProject }) => (
  <Swipeable
    leftActionActivationDistance={150}
    leftContent={(
      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20, backgroundColor: '#5f5'}} >
        <Icon
          name="lock-open"
          size={28}
          color='white'
        />
      </View>
    )} 
    rightButtons={[
      <TouchableHighlight
        underlayColor='white'
        activeOpacity={0.5}
        onPress={onPress}
        style={[style.rightSwipeButton, { backgroundColor: '#cfc' }]}>
        <Icon
          name='mode-edit'
          size={28}
          color='black'
        />
      </TouchableHighlight>,
      <TouchableHighlight 
        underlayColor='white'
        activeOpacity={0.5}
        onPress={onCloseProject}
        style={[style.rightSwipeButton, { backgroundColor: '#f55' }]}>
        <Icon
          name="close"
          size={28}
          color='white'
        />
      </TouchableHighlight>,
    ]}
    onLeftActionComplete={onPullLeft}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
    >
    <View style={[style.view, {  backgroundColor: item.status === 'closed' ? '#ddd' : '#fff' }]}>
      <View style={ { backgroundColor: item.status === 'closed' ? '#f55' : '#5f5', width: 7, marginRight: 10 }}/>
      <View style={{paddingVertical: 15, paddingHorizontal: 5, flex:1, flexDirection: 'row' }}>
        <Text style={style.title}>
          {item.name}
        </Text>
      </View>
    </View>
  </Swipeable>

)
