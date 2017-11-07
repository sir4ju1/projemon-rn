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
    paddingVertical: 15,
    borderRadius: 2,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 5
  },
  title: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
  },
  workCount: {
    flex: 1,
    alignItems: 'flex-end'
  },
  workCountText: {    
    fontSize: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#eee'

  }
})

export default ({ item, onPress, onOpen, onClose }) => (
  <View style={style.view}>
    <View style={{ flex:1, flexDirection: 'row', paddingBottom: 10, paddingHorizontal: 10 }}>
      <Text style={[style.title, { paddingVertical: 10 }]}>
        {item.name}
      </Text>
      <View style={style.workCount}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableHighlight underlayColor='white' activeOpacity={0.5} onPress={() => { console.log('hi') }} >
            <Text style={[style.workCountText, { fontSize: 20, width: 56, height: 40, textAlign: 'center', textAlignVertical: 'center' }]} >
              {item.taskClosed}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='white' activeOpacity={0.5} onPress={() => { console.log('hi') }} >
            <Text style={[style.workCountText, { fontSize: 20, marginLeft: 5, width: 56, height: 40, textAlign: 'center', textAlignVertical: 'center' }]}>
              {item.taskCount}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
    <View style={{ borderColor: '#ddd', borderBottomWidth: 1, marginVertical: 6 }} />
    {
      item.members.filter(m => !(m.taskActive === 0 && m.taskClosed === 0 && m.taskCount === 0)).map(m => {
        return (
          <View style={{ margin: 1, paddingHorizontal: 15 }} key={m._id}>
            <View style={{ flex:1, flexDirection: 'row' }}>
              <View style={{ backgroundColor: m.taskCount === 0 ? 'lightgreen' : m.taskCount > 0 && m.taskActive === 0 ? 'yellow' : 'lightblue', padding: 4, width: 22, height: 22, borderRadius: 30, marginRight: 5 }}>
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
                <TouchableHighlight underlayColor='white' activeOpacity={0.5} onPress={() => { console.log('hi') }} >
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={[style.workCountText, { width: 48, paddingVertical: 6, marginHorizontal: 3, textAlign: 'center' }]}>
                      {m.taskCount}
                    </Text>
                    <Text style={[style.workCountText, { width: 48, paddingVertical: 6, marginHorizontal: 3, backgroundColor: 'lightblue', textAlign: 'center' }]}>
                      {m.taskActive}
                    </Text>
                    <Text style={[style.workCountText, { width: 48, paddingVertical: 6, marginHorizontal: 3, textAlign: 'center', backgroundColor: 'lightgreen' }]}>
                      {m.taskClosed}
                    </Text>
                  </View>
                </TouchableHighlight>
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
                <Text style={{ marginVertical: 2, fontSize: 12, color:  moment(it.finishDate).diff(moment(), 'days') >= 0 ? '#5f5' : '#f55'}}>
                  {moment(it.startDate).format('DD-MMM-YYYY')} - {moment(it.finishDate).format('DD-MMM-YYYY')}
                </Text>
                
              </View>
              <View style={style.workCount}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ borderRadius: 48, borderWidth: 1, borderColor: '#eee', width: 48, marginHorizontal: 3, textAlign: 'center', textAlignVertical: 'center' }}>
                    {moment(it.finishDate).diff(moment(), 'days')}
                  </Text>
                  <TouchableHighlight underlayColor='white' activeOpacity={0.5} onPress={() => { console.log('hi') }} >
                    <Text style={[style.workCountText, { width: 48, height: 40, marginHorizontal: 3, textAlign: 'center', textAlignVertical: 'center' }]}>
                      {it.taskCount}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        )
      })
    }
  </View>
)
