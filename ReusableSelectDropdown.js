import React from 'react';
import { StyleSheet, Platform} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Child component that helps to render the dropdown boxes
const ReusableSelectDropdown = ({
  data,
  onSelect,
  buttonTextAfterSelection,
  rowTextForSelection,
  defaultButtonText,
}) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem) => onSelect(selectedItem)}
      buttonTextAfterSelection={(selectedItem, index) => buttonTextAfterSelection(selectedItem, index)}
      rowTextForSelection={(item, index) => rowTextForSelection(item, index)}
      buttonStyle={styles.dropdownBtnStyle}
      renderDropdownIcon={(isOpened) => (
        <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#FFF'} size={18} />
      )}
      defaultButtonText={defaultButtonText}
      dropdownStyle={styles.dropdownDropdownStyle}
      rowStyle={styles.dropdownRowStyle}
      rowTextStyle={styles.dropdownRowTxtStyle}
      buttonTextStyle={styles.dropdownBtnTxtStyle}
    />
  );
};

export default ReusableSelectDropdown;

const styles = StyleSheet.create({
  dropdownBtnStyle: {
    width: 180,
    height: Platform.OS === 'ios' ? 80 : 70,
    backgroundColor: '#95b8d1',
    borderRadius: 8,
  },
  dropdownBtnTxtStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15
  },
  dropdownRowStyle: {
    backgroundColor: 'white', 
    borderBottomColor: 'black'
  },
  dropdownRowTxtStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdownDropdownStyle: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  }, 
});