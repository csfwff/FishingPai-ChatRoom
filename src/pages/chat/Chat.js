import React, { Component } from 'react';
import './Chat.less';
import request from '../../utils/Http';
import { Input, Button, message, List, Avatar } from 'antd';
import SparkMD5 from 'spark-md5'
import ReconnectingWebSocket from "reconnecting-websocket";
import io from 'socket.io-client';


type Props = {
    history: Object,
};




class Chat extends Component<Props, State> {

    token = ""
    content = ""


    state = {
        submiting: false,
        data: [{
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },]
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
                    <Input disabled={this.state.submiting} className="inputItem" size="large" placeholder="随便写点" onChange={(e) => this.content = e.target.value} />
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
                                <Avatar className="avatar" src="https://joeschmoe.io/api/v1/random" />
                                <div className="msgItemContain">
                                    <div className="msgName">name</div>
                                    <div className="msgContain">
                                        <div className="arrow" />
                                        <div className="msgContent" dangerouslySetInnerHTML={{ __html: "<h2>2222</h2>" }} />
                                    </div>

                                </div>
                            </div>
                        )
                    }}
                />
            </div>
        );
    }


    _initWs = () =>{
        let rws = new ReconnectingWebSocket("wss://pwl.icu/chat-room-channel");
 
        // let rws = new ReconnectingWebSocket("ws://localhost:3000/sockjs-node");
        

        rws.onopen = ()=>{
            console.log("open");
        }
        rws.onmessage = (e) =>{
            console.log("onmessage");
        
        }
        rws.onerror = (e) =>{
            console.log("onerror");
        
        }
        rws.onclose = (e) =>{
            console.log("onclose");
        }

        // const soc = io("wss://pwl.icu/chat-room-channel")
        // soc.on("connect", () => {
        //     console.log(1111);
        //   });
          
        // soc.on("data", () => {  console.log(222); });

    }


    _biu = () => {
        if (!this.doing) {
            this.doing = true;

            this.setState({
                loading: true
            })

            let postData = {
                content: this.content
            }

            console.log(postData);

            request('chat-room/send', postData,null,"sym-ce="+this.token)
                .then((data) => {
                    this.doing = false;
                    this.setState({
                        loading: false
                    })
                    if (data.code === 0) {
 
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

