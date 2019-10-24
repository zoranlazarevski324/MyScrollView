import React, {Component} from 'react'
import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
import users from './data'
import ActiveItem from './ActiveItem';

class NonActiveItem extends Component {
    render() {
        return (
            <View style={{width: '100%', height: this.props.hei, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{uri: this.props.item.photo}} style={{width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: 'green'}}/>
            </View>
        )
    }
}

class HomeScreen extends Component {

    constructor() {
        super()
        
        this.itemHei = 100
        this.activeHei = 200
        this.screenWidth = Math.round(Dimensions.get('window').width);
        this.screenHeight = Math.round(Dimensions.get('window').height);
        this.defaultOffset = (this.screenHeight - this.activeHei + 20 /* padding */) / this.itemHei / 2
        const initno = Math.round(this.defaultOffset)
        this.preYOffset = 0

        this.state = {
            active_no: users.length < (initno + 1) ? users.length - 1 : initno,
            users: users,
        }
    }

    componentDidMount() {
        if(users.length >= 2){
            setTimeout(
                () => {
                    this.preYOffset = 1
                    this._scrollView.scrollTo({y: 1, animated: false })
                }, 
            10);
        }
    }

    removeItemWithTimeout = (index) => {
        setTimeout(
            () => this.removeItem(index),
            100
        )
    }

    removeItem = (index) => {
        if(users.length < 3){
            users.splice(0, 1)
            this.setState({users})
            return 
        }

        var items = [...this.state.users]

        // after delete the item, scroll is not appear
        const fullHei = (users.length - 2) * this.itemHei + this.activeHei
        console.log("users.length = " + users.length + "\tfullHeight = " + fullHei + "\tscreenHeight = " + this.screenHeight)
        if(fullHei < this.screenHeight) {
            var active_no = this.state.active_no % users.length
            const i = index % users.length
            users.splice(i, 1)
            
            if (active_no > users.length - 1)
                active_no = users.length - 1

            console.log("active_no = " + active_no)
            this.setState({active_no, users})
            this.defaultOffset = (users.length - 1) / 2
            setTimeout(
                () => {
                    this.preYOffset = 1
                    this._scrollView.scrollTo({y: 1, animated: false })
                },
            10);
        } else if (index >= users.length) {
            const i = index % users.length
            items.splice(index, 1)
            items.splice(i, 1)
            users.splice(i, 1)
            
            const yPos = this.preYOffset - this.itemHei
            this.preYOffset = yPos
            this._scrollView.scrollTo({y: yPos})

            const offset = yPos/this.itemHei
            var active_no = Math.round(this.defaultOffset + offset)
            this.setState({active_no, users: items})
        } else {
            if(items.length == users.length){
                items.concat(users)
            }

            items.splice(index + users.length, 1)
            items.splice(index, 1)
            users.splice(index, 1)
            
            const yPos = this.preYOffset
            this._scrollView.scrollTo({y: yPos})

            const offset = yPos/this.itemHei
            var active_no = Math.round(this.defaultOffset + offset)
            this.setState({active_no, users: items})
        }
    }

    onScrollUsers (event) {
        // solution 3
        const smoothOffset = 30
        const contentYOffset = event.nativeEvent.contentOffset.y
        if ((this.preYOffset > contentYOffset && contentYOffset < smoothOffset) || contentYOffset < 0) {
            console.log('top')
            var newList = [...this.state.users]
            newList.length = users.length
            newList = users.concat(newList)
            this.setState({users: newList})
            
            const yPos = users.length * this.itemHei + contentYOffset
            setTimeout(
                () => {
                    this.preYOffset = yPos
                    this._scrollView.scrollTo({y: yPos, animated: false})
                }, 
            10);

            const offset = yPos/this.itemHei
            var active_no = Math.round(this.defaultOffset + offset)          
            this.setState({active_no})
        } else if(this.preYOffset < contentYOffset && event.nativeEvent.contentSize.height - contentYOffset - event.nativeEvent.layoutMeasurement.height < smoothOffset ) {
            console.log('bottom')
            var newList = [...this.state.users]
            newList.length = users.length
            newList = newList.concat(users)
            this.setState({users: newList})
            
            const yPos = contentYOffset % (users.length * this.itemHei)
            this.preYOffset = yPos
            this._scrollView.scrollTo({y: yPos, animated: false})

            const offset = yPos/this.itemHei
            var active_no = Math.round(this.defaultOffset + offset)
            this.setState({active_no})
        } else {

            const yPos = contentYOffset
            const offset = yPos/this.itemHei
            var active_no = Math.round(this.defaultOffset + offset)
            this.setState({active_no})
        }
        this.preYOffset = contentYOffset
    }

    render() {

        if(!this.state.users || this.state.users.length === 0) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, color: 'black'}}>No list</Text>
                </View>
            )
        }

        if(users.length === 1){
            return (
                <View  style={{flex: 1, justifyContent: 'center', align: 'center'}}>
                    <View>
                        <ScrollView 
                            ref={ref => this._scrollView = ref}
                            onScroll={(event) => this.onScrollUsers(event)}
                            style={{width: '100%', height: this.activeHei}}
                            showsVerticalScrollIndicator={false} >
                            <ActiveItem 
                                item={users[0]} 
                                key={0} 
                                hei={this.activeHei} 
                                onRightSwipe={() => this.removeItemWithTimeout(0)} 
                                onLeftSwipe={() => this.removeItemWithTimeout(0)} 
                                clickEvent={() => this.props.navigation.navigate('user')}/>
                        </ScrollView>
                    </View>
                </View>
            )
        }
        
        const fullHei = (users.length - 1) * this.itemHei + this.activeHei
        if (fullHei < this.screenHeight) {
            
            return (
                <View  style={{flex: 1, justifyContent: 'center', align: 'center'}}>
                    <View>
                        <ScrollView 
                            ref={ref => this._scrollView = ref}
                            onScroll={(event) => this.onScrollUsers(event)}
                            style={{width: '100%', height: fullHei - 10}}
                            showsVerticalScrollIndicator={false} >
                            {
                                this.state.users.map((item, index) => 
                                    this.state.active_no === index ? (
                                        <ActiveItem 
                                            item={item} 
                                            key={index} 
                                            hei={this.activeHei} 
                                            onRightSwipe={() => this.removeItemWithTimeout(index)} 
                                            onLeftSwipe={() => this.removeItemWithTimeout(index)} 
                                            clickEvent={() => this.props.navigation.navigate('user')}/>
                                    ) : (
                                        <NonActiveItem item={item} key={index} hei={this.itemHei} />
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            )
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView 
                    ref={ref => this._scrollView = ref}
                    onScroll={(event) => this.onScrollUsers(event)}
                    style={{flex: 1, width: '100%'}}
                    showsVerticalScrollIndicator={false} >
                    {
                        this.state.users.map((item, index) => 
                            this.state.active_no === index ? (
                                <ActiveItem 
                                    item={item} 
                                    key={index} 
                                    hei={this.activeHei} 
                                    onRightSwipe={() => this.removeItemWithTimeout(index)} 
                                    onLeftSwipe={() => this.removeItemWithTimeout(index)} 
                                    clickEvent={() => this.props.navigation.navigate('user')}/>
                            ) : (
                                <NonActiveItem item={item} key={index} hei={this.itemHei} />
                        ))
                    }
                </ScrollView>
            </View>
        )
    }
}

export default HomeScreen