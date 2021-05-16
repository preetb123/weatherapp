import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  TextInput,
} from 'react-native';
import BackArrow from '../../../assets/arrow_back.svg';
import ClearIcon from '../../../assets/clear.svg';

import { debounce } from 'lodash';

type SearchBarProps = {
  placeholder: string;
  onBackPress: (e: GestureResponderEvent) => void;
  onTextChange: (text: string) => void;
};

export const SearchBar = (props: SearchBarProps) => {
  const { onBackPress, onTextChange } = props;
  const [text, setText] = useState('');

  const handler = useCallback(debounce(onTextChange, 600), []);

  const clearText = () => {
    setText('');
    handler('');
  };

  const onChange = (inputText: string) => {
    setText(inputText);
    handler(inputText);
  };

  return (
    <View style={styles.inputContainer}>
      <Pressable testID="back" style={styles.backButton} onPress={onBackPress}>
        <BackArrow height={24} width={24} fill={'grey'} />
      </Pressable>
      <TextInput
        {...props}
        style={styles.textInput}
        autoFocus={true}
        onChangeText={onChange}
        value={text}
      />
      <Pressable style={styles.eraseButton} onPress={clearText}>
        <ClearIcon height={24} width={24} fill={'grey'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  eraseButton: {
    paddingLeft: 8,
  },
  textInput: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 8,
  },
});
