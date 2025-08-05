import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { styles } from '../styles/styles';
import TabNameEditor from './TabNameEditor';

const TabBar = ({
  tabs,
  activeTabId,
  onTabChange,
  onAddTab,
  onEditTab,
  onDeleteTab,
  isDeleteMode = false,
  keyboardHeight = 0,
}) => {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // タブ名編集開始
  const startEditingTab = (tabId, currentName) => {
    setEditingTabId(tabId);
    setEditingText(currentName);
  };

  // タブ名保存
  const saveTabName = () => {
    if (editingText.trim()) {
      onEditTab(editingTabId, editingText.trim());
    }
    setEditingTabId(null);
    setEditingText('');
  };

  // タブ名編集キャンセル
  const cancelEditingTab = () => {
    setEditingTabId(null);
    setEditingText('');
  };

  // タブ削除確認
  const confirmDeleteTab = (tabId, tabName) => {
    if (tabs.length <= 1) {
      Alert.alert('削除できません', '最低1つのタブは必要です。');
      return;
    }
    
    Alert.alert(
      'タブを削除',
      `「${tabName}」を削除しますか？\nこのタブのすべてのタスクも削除されます。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => onDeleteTab(tabId) }
      ]
    );
  };

  return (
    <View style={styles.tabBarContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTabId === tab.id && styles.activeTab
            ]}
            onPress={() => onTabChange(tab.id)}
            onLongPress={() => startEditingTab(tab.id, tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
                {isDeleteMode && tabs.length > 1 && (
                  <TouchableOpacity
                    style={styles.tabDeleteButton}
                    onPress={() => confirmDeleteTab(tab.id, tab.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.tabDeleteButtonText}>×</Text>
                  </TouchableOpacity>
                )}
                <Text style={[
                  styles.tabText,
                  activeTabId === tab.id && styles.activeTabText
                ]}>
                  {tab.name}
                </Text>
              </View>
          </TouchableOpacity>
        ))}
        
        {/* 新規タブ追加ボタン */}
        <TouchableOpacity
          style={styles.addTab}
          onPress={onAddTab}
          activeOpacity={0.7}
        >
          <Text style={styles.addTabText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* タブ名編集モーダル */}
      <TabNameEditor
        visible={!!editingTabId}
        tabName={editingTabId ? tabs.find(tab => tab.id === editingTabId)?.name : ''}
        editingText={editingText}
        setEditingText={setEditingText}
        onSaveEdit={saveTabName}
        onCancelEditing={cancelEditingTab}
        keyboardHeight={keyboardHeight}
      />
    </View>
  );
};

export default TabBar;