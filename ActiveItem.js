import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing, Image } from 'react-native'
import Toast from 'react-native-simple-toast'
import Swiper from 'react-native-swiper-animated';

class ActiveItem extends Component {

    onSwipeLeft = () => {
        this.props.onLeftSwipe(),
        Toast.show('left swiped')
    }

    onSwipeRight = () => {
        this.props.onRightSwipe(),
        Toast.show('right swiped')
    }

    render() {
        return (
            <Swiper
                smoothTransition
                showPagination={false}
                onRightSwipe={() => this.onSwipeRight()}
                onLeftSwipe={() => this.onSwipeLeft()}
                index={1} >
                <View style={{width: '100%', height: this.props.hei}} />
                <TouchableOpacity onPress={() => this.props.clickEvent()}>
                    <View style={{
                        width: '100%', paddingVertical: 10, height: this.props.hei, backgroundColor: 'white',
                        shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                        shadowRadius: 3.84, elevation: 5, justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Image source={{ uri: this.props.item.photo }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'green', marginVertical: 10 }} />
                        <Text style={{ fontSize: 20, color: 'black' }}>{this.props.item.title}</Text>
                        <Text style={{ fontSize: 16, color: 'gray' }} numberOfLines={1}>{this.props.item.text}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{width: '100%', height: this.props.hei}} />
            </Swiper>
        )
    }
}

export default ActiveItem