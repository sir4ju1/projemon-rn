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
    paddingRight: 50
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
  }

})

export default ({ item, type }) =>  (
  <View style={[style.view, { backgroundColor: type === 'section' ? 'white' : '#eee', borderBottomWidth: type === 'section' ? 1 : 0.5, borderColor: '#ddd'  }]}>
    {
      item.type === 'Task' ?
        <View style={style.task} /> :
        item.type === 'Bug' ?
          <View style={style.bug} /> :
          <View style={style.backlog} />
    }


    <View style={{ paddingRight: 10, paddingVertical: 10 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
      {
        item.state === 'Closed' ?
        <Icon
        style={{ padding: 3, fontWeight: 'bold'}}
        name='done'
        size={16}
        color='#0f0' />: <View />
      }
      <Text style={style.title}>
        {item.title}
      </Text>
      </View>
      {
        item.state === 'Closed' ?
        <Text style={{fontSize: 12, marginTop: 5 }}>
          {moment(item.activatedDate).format('DD-MMM-YYYY')} - {moment(item.closedDate).format('DD-MMM-YYYY')} - ({moment(item.closedDate).diff(moment(item.activatedDate), 'days')} Days)
      </Text> :
      <View>
      </View>
      }
    </View>
  </View>
)
