import React from 'react'
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'

const style = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 2,
    borderColor: '#ddd',
    borderWidth: 1,
    margin: 5,
    marginTop: 2,
    marginBottom: 2
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
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#eee'

  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }
})

export default ({ item, onPress, onOpen, onClose }) => (
  <View style={style.view}>
    <View style={{ flex:1, flexDirection: 'row', paddingHorizontal: 10 }}>
      <Text style={style.title}>
        {item.name}
      </Text>
      <View style={style.workCount}>
        <Text style={[style.workCountText, { fontSize: 18 }]}>
          {item.taskClosed}/{item.taskCount}
        </Text>
      </View>
    </View>
    <Text>
      {item.description}
    </Text>
    <View style={{ borderColor: '#ddd', borderBottomWidth: 1, marginVertical: 10 }} />
    {
      item.members.map(m => {
        return (
          <View style={{ margin: 1, paddingHorizontal: 15 }} key={m._id}>
            <View style={{ flex:1, flexDirection: 'row' }}>
              <View style={{ backgroundColor: m.taskCount === 0 ? 'lightgreen' : m.taskCount > 0 && m.taskActive === 0 ? 'yellow' : 'blue', padding: 4, width: 22, height: 22, borderRadius: 30, marginRight: 5 }}>
                <Icon
                  name='check'
                  size={14}
                  color='white'
                />
              </View>
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingTop: 1 }}>
                {m.displayName}
              </Text>
              <View style={style.workCount}>
                
                <Text style={[style.workCountText, { paddingVertical: 3 }]}>
                  {m.taskCount}/{m.taskActive}/{m.taskClosed}
                </Text>
              </View> 
            </View>
           
          </View>
        )
      })
    }
    <View style={{ borderColor: '#ddd', borderBottomWidth: 1, marginVertical: 10 }} />
    {
      item.iterations.filter(it => it.status === 'plan').map(it => {
        return (
          <View style={{ margin: 1, paddingHorizontal: 15 }} key={it._id}>
            <View  style={{ flex:1, flexDirection: 'row' }} >
              <View style={{ flex: 1, flexDirection: 'column'}}>
                <Text style={{ fontWeight:'bold' }}>
                  {it.name}
                </Text>
                <Text style={{ marginVertical: 2, fontSize: 12, color:  moment(it.finishDate).diff(moment(), 'days') >= 0 ? 'green' : 'red'}}>
                  {moment(it.startDate).format('DD-MMM-YYYY')} - {moment(it.finishDate).format('DD-MMM-YYYY')}
                </Text>
                
              </View>
              <View style={style.workCount}>
                <Text style={[style.workCountText, { paddingVertical: 10 }]}>
                  {moment(it.finishDate).diff(moment(), 'days')}/{it.taskCount}
                </Text>
              </View>
            </View>
          </View>
        )
      })
    }
  </View>
)
