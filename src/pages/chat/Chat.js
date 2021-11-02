import React, { Component } from 'react';
import './Chat.less';
import request from '../../utils/Http';
import { Input, Button, message, List, Avatar } from 'antd';
import ReconnectingWebSocket from "reconnecting-websocket";


type Props = {
    history: Object,
};


class Chat extends Component<Props, State> {

    token = ""



    state = {
        submiting: false,
        data: [],
        content :""
    }


    componentWillMount() {
        this.token = window.cookie.get('sym-ce');
    }

    componentDidMount() {
        document.title = "聊天室";
        if (document.body !== null) {
            document.body.style.backgroundColor = '#FFFFFF';
        }
        this._initWs()
    }

    componentWillUnmount() {
        if (document.body !== null) {
            document.body.style.backgroundColor = 'rgb(241,241,241)';
        }
    }

    render() {
        return (
            <div className="Chat">
                <div className="InputLine">
                    <Input disabled={this.state.submiting} className="inputItem"  value={this.state.content}
                    onPressEnter={()=>this._biu()}
                     size="large" placeholder="随便写点" onChange={(e) => this.setState({content:e.target.value})} />
                    <Button type="primary" loading={this.state.submiting} className="submitBtn" onClick={() => this._biu()}>
                        biu~
                    </Button>
                </div>

                <List
                    className="dataList"
                    itemLayout="vertical"
                    dataSource={this.state.data}
                    renderItem={item => {
                        return (
                            <div className="msgItem">
                                <Avatar className="avatar" src={item.userAvatarUrl} />
                                <div className="msgItemContain">
                                    <div className="msgName">{item.userName}</div>
                                    <div className="msgContain">
                                        <div className="arrow" />
                                        <div className="msgContent" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    </div>

                                </div>
                            </div>
                        )
                    }}
                />
            </div>
        );
    }


    _initWs = () => {
        //let rws = new ReconnectingWebSocket("wss://pwl.icu/chat-room-channel");
        let rws = new ReconnectingWebSocket("wss://pwl.icu/chat-room-channel?type=index");

        // let rws = new ReconnectingWebSocket("ws://localhost:3000/sockjs-node");

        rws.reconnectInterval = 10000

        rws.onopen = (e) => {
            console.log("onopen");
            setInterval(function () {
                rws.send('-hb-')
            }, 1000 * 60 * 3)
        }
        rws.onmessage = (e) => {
            console.log("onmessage");
            console.log(e)
            let msg = JSON.parse(e.data)
            switch (msg.type) {
                case "online":  //在线人数
                    break;
                case "revoke":  //撤回
                    break;
                case "msg":  //消息
                    let msglist = this.state.data
                    msglist.splice(0,0,msg)
                    this.setState({
                        data:msglist
                    })
                    break;
            }

        }
        rws.onerror = (e) => {
            console.log("onerror");

        }
        rws.onclose = (e) => {
            console.log("onclose");
        }



    }


    _biu = () => {

        if (!this.doing) {
            this.doing = true;

            this.setState({
                loading: true
            })

            let postData = {
                content: this.state.content
            }

            console.log(postData);

            request('chat-room/send', postData, null, "sym-ce=" + this.token)
                .then((data) => {
                    this.doing = false;
                    this.setState({
                        loading: false
                    })
                    if (data.code === 0) {
                        this.setState({
                            content:""
                        })
                    } else {
                        message.error(data.msg);
                    }
                }).catch((error) => {
                    this.setState({
                        loading: false
                    })
                    message.error('网络连接异常');
                });
        }
    }


    // 由于iOS端微信webview，输入框失去焦点之后，页面不会自动下滑回到原位，所以自己处理。
    _kickBack = () => {
        setTimeout(() => {
            if (document.body !== null) {
                window.scrollTo(0, document.body.scrollTop + 1);
                if (document.body !== null) {
                    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
                }
            }
        }, 10);
    }



}

export default Chat;

