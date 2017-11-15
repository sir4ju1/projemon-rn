import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swipeable from 'react-native-swipeable'

const style = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',   
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 20
  },
  sideColor: {
    width: 5,
    marginRight: 10
  },
  backlog: {
    backgroundColor: '#ddd'
    
  },
  task: {
    backgroundColor: 'skyblue',
  },
  bug: {
    backgroundColor: '#f55',
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }

})

export default ({ item, type, onPress, onOpen, onClose }) =>  (
  <Swipeable
  rightButtons={[
    <TouchableHighlight
      underlayColor='green'
      onPress={onPress}
      style={[style.rightSwipeButton, { backgroundColor: '#d4d400' }]}>
      <Icon
        name='new-releases'
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
    marginTop: type === 'section' ? 5 : 0.5,
    borderTopWidth: type === 'section' ? 1 : 0,
    borderBottomWidth: type === 'section' ? 0 : 1,
    borderColor: '#aaa',
    minHeight: 50
  }]}>
    {
      item.type === 'Task' ?
        <View style={[style.sideColor, style.task]} /> :
        item.type === 'Bug' ?
          <View style={[style.sideColor, style.bug]} /> :
          <View style={[style.sideColor, style.backlog]} />
    }

    <View style={{ flex: 1, flexDirection: 'column' } }>
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5 }}>
        <Icon
          style={{ paddingTop: 1, paddingRight: 2 }}
          name='check-circle'
          size={16}
          color={ item.state === 'Closed' ? 'green' : '#bbb' } />
          <Text style={style.title}>
          {item.title}
        </Text>

      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 5}}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          {
            type === 'section' ?
            <Text>
              {item.iteration}
            </Text> :
            item.state === 'Closed' && type !== 'section' ?
            <Text style={{ fontSize: 12 }}>
                {moment(item.closedDate).format('DD-MMM-YYYY')} ({moment(item.closedDate).diff(moment(item.activatedDate), 'hours') > 0 ? moment(item.closedDate).diff(moment(item.activatedDate), 'hours') : 0} h)
            </Text> :
            <View />             
             
            
          }
        </View>
        {
           item.isOpt && type !== 'section' ?
            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
              <Text style={{color: '#333', padding: 2, borderRadius: 2, backgroundColor: '#d4d400'}}>
                Extra
              </Text>
            </View> :
            <View />
        }
      </View>
    </View>
  </View>
  </Swipeable>
)
