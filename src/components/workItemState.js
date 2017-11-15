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
import moment from 'moment'

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
  sideColor: {
    width: 5,
    marginRight: 10
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }

})

export default ({ item, type, onPress, onOpen, onClose  }) =>  (
  <Swipeable
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
    <View style={[style.view, {
      backgroundColor: type === 'section' ? 'white' : '#eee',
      borderBottomWidth: type === 'section' ? 1 : 0.5,
      minHeight: 50,
      borderColor: '#aaa'   }]}>
      <View style={[style.sideColor, { backgroundColor: type === 'section' ? '#ddd' : 'lightblue' }]} />
      <View style={{ paddingRight: 10, paddingVertical: 10 }}>
        <Text style={style.title}>
          {item.title}
        </Text>
        
        <View>
          {
            item.isOpt ? 
              <Text style={{color: '#d4d400'}}>
                Extra
              </Text>
            : <View />
          }
        </View>
      </View>
    </View>
  </Swipeable>
)
