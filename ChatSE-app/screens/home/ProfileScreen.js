import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import Header from '../../components/Header';
import { removeItem } from '../../utils/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '../../redux/selector';
import userInfoSlice from '../../redux/slice/userInfoSlice';
import conversationsSlice from '../../redux/slice/conversationSlice';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector(userInfoSelector);
    const [modalVisible, setModalVisible] = useState(false);

    const settings = [
        {
            name: 'Đổi mật khẩu',
            icon: 'key',
            key: 'zqsiEw',
            onPress: () => navigation.navigate('ReplacePassWord', { isChange: true, phoneNumber: userInfo.phoneNumber, userId: userInfo._id })
        },
        {
            name: 'Đăng xuất',
            icon: 'logout',
            key: 'iaT1Ex',
            onPress: () => setModalVisible(true)
        },
    ];

    const logout = async () => {
        await removeItem('user_token');
        dispatch(userInfoSlice.actions.refreshToLogout());
        dispatch(conversationsSlice.actions.resetConversation([]));
        navigation.navigate('LoginScreen');
    };

    const handleLogout = () => {
        setModalVisible(false);
        logout();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={item.onPress}>
            <ListItem containerStyle={styles.listItem}>
                <Avatar rounded icon={{ name: item.icon, type: 'font-awesome' }} />
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* <Header /> */}
            <View style={styles.header}>
                <Text style={styles.headerText}>TRANG CÁ NHÂN</Text>
            </View>
            <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('PersonalScreen', { isMe: true })}>
                <Avatar rounded size="large" source={{ uri: userInfo.avatarLink }} />
                <Text style={styles.name}>{userInfo.fullName}</Text>
                <Text style={styles.phone}>{userInfo.phoneNumber}</Text>
            </TouchableOpacity>
            <FlatList
                data={settings}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={styles.list}
            />
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bạn có muốn đăng xuất?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#2196F3'}]} onPress={handleLogout}>
                                <Text style={styles.textStyle}>Có</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#f44336'}]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.textStyle}>Không</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#3475F5',
        paddingVertical: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    phone: {
        color: '#666',
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    list: {
        marginVertical: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        borderRadius: 5,
        padding: 10,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProfileScreen;
