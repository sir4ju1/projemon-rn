import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'

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
  }

})

export default ({ item, type }) =>  (
  <View style={[style.view, { 
    backgroundColor: type === 'section' ? 'white' : '#eee', 
    borderBottomWidth: type === 'section' ? 1 : 0.5, 
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
        {
          item.state === 'Closed' ?
            <Icon
              style={{ padding: 3, fontWeight: 'bold' }}
              name='done'
              size={16}
              color='green' /> : <View />
        }
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
            <View />
          }
        </View>
        {
          item.state === 'Closed' && type !== 'section' ?
            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
              <Text style={{ fontSize: 12 }}>
                {moment(item.closedDate).format('DD-MMM-YYYY')} - ({moment(item.closedDate).diff(moment(item.activatedDate), 'hours') > 0 ? moment(item.closedDate).diff(moment(item.activatedDate), 'hours') : 0} h)
              </Text>
            </View> :
            <View />
        }
      </View>
    </View>
  </View>
)
