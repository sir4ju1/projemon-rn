import React from 'react';
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const DrawerButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('DrawerOpen')}
    style={styles.buttonStyle}>
    <Icon
      name="menu"
      size={28}
    />
  </TouchableOpacity>
);

DrawerButton.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginLeft: 10
  }
})
export default DrawerButton
