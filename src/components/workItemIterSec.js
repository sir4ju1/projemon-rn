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
    style={{ borderColor: '#aaa', borderTopWidth: 1 }}
  >
    <View style={{ flex: 1, flexDirection: 'column',
      backgroundColor: type === 'section' ? 'white' : '#eee',
        borderTopWidth: type === 'section' ? 3 : 0.5,
        borderLeftWidth: type === 'section' ? 5 : 0,
        minHeight: 50,
        borderColor: '#ddd',
        paddingBottom: 8, paddingHorizontal: 10 }}>

      <View style={style.view}>
        {
          item.state === 'Closed' ?
            <Icon
              style={{ paddingTop: 10, paddingRight: 3, fontWeight: 'bold' }}
              name='done-all'
              size={16}
              color='green' /> : <View />
        }
        <View style={{ paddingRight: 10, paddingVertical: 10 }}>
          <Text style={style.title}>
            {item.title}
          </Text>
        </View>
      </View>
    </View>
  </Swipeable>
)
