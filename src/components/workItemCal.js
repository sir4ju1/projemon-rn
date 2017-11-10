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
  backlog: {
    backgroundColor: 'yellow',
    width: 5,
    marginRight: 10
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
        underlayColor='white'
        activeOpacity={0.5}
        onPress={onPress}
        style={[style.rightSwipeButton, { backgroundColor: 'lightgreen' }]}>
        <Icon
          name='print'
          size={28}
          color='black'
        />
      </TouchableHighlight>
    ]}
    onRightButtonsOpenRelease={onOpen}
    onRightButtonsCloseRelease={onClose}
  
  >
    <View style={style.view}>
      <View style={style.backlog} />
      <View style={{ paddingRight: 10, paddingVertical: 10 }}>
        <Text style={style.title}>
          {item.title}
        </Text>
        <Text>
          {item.iteration}
        </Text>
        <Text style={{fontSize: 12 }}>
          {moment(item.activatedDate).format('DD-MMM-YYYY')} - {moment(item.closedDate).format('DD-MMM-YYYY')} - ({moment(item.closedDate).diff(moment(item.activatedDate), 'days')} Days)
        </Text>
      </View>
    </View>
  </Swipeable>
)
