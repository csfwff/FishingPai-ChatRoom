import React, { Component } from 'react';
import './Login.less';
import request from '../../utils/Http';
import { Input ,Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import SparkMD5 from 'spark-md5'

type Props = {
    history: Object,
};

class Login extends Component<Props, State> {

    account = ""
    pwd = ""

    state = {
        loading: false,
    }


    componentWillMount() {

    }

    componentDidMount() {
        document.title = "登录";
        if (document.body !== null) {
            document.body.style.backgroundColor = '#FFFFFF';
        }
        let userCookie = window.cookie.get('sym-ce');
        if (userCookie !== undefined && userCookie !== null && userCookie !== 'undefined' && userCookie.length > 0) {
            this.props.history.replace({ pathname: 'chat' });
            window.electron.ipcRenderer.send('token',userCookie)
        }
        console.log(userCookie);
    }

    componentWillUnmount() {
        if (document.body !== null) {
            document.body.style.backgroundColor = 'rgb(241,241,241)';
        }
    }

    render() {
        return (
            <div className="Login">
                <div className="inputBox">
                    <img src={require("../../img/mplogo_128.png").default} className="LogoImg" alt="logo" />
                    <Input disabled={this.state.loading} className="inputItem" size="large" placeholder="用户名" onChange={(e)=>this.account=e.target.value} prefix={<UserOutlined />} />
                    <Input.Password disabled={this.state.loading} className="inputItem" size="large" placeholder="密码" onChange={(e)=>this.pwd=e.target.value} prefix={<LockOutlined />} />

                    <Button type="primary" loading={this.state.loading} className="loginBtn" onClick={()=>this._login()}>
                        登录
                    </Button>
                </div>

            </div>
        );
    }


    _login = () => {
        //this.props.history.push({ pathname: "home" });
        let formIsOk = this._validatePhoneForm();
        if (formIsOk) {
            this._loginRequest();
        }

    }


    _validatePhoneForm = () => {
        let formIsOk = false;
        if (this.account.length === 0) {
            message.error('请输入账号');
        } else if (this.pwd.length === 0) {
            message.error('请输入密码');
        } else {
            formIsOk = true;
        }
        return formIsOk;
    }

    _loginRequest = () => {
        if (!this.doing) {
            this.doing = true;

            this.setState({
                loading:true
            })

            let postData = {
                nameOrEmail: this.account,
                rememberLogin:true,
                userPassword: SparkMD5.hash(this.pwd)
            }

            console.log(postData);

            request('login', postData)
                .then((data) => {
                    this.doing = false;
                    this.setState({
                        loading:false
                    })
                    if (data.code === 0) {
                        window.cookie.set('sym-ce', data.token);
                        window.electron.ipcRenderer.send('token',data.token)
                        this._goNextPage('chat');
                    } else {
                        message.error(data.msg);
                    }
                }).catch((error) => {
                    this.setState({
                        loading:false
                    })
                    message.error('网络连接异常');
                });
        }
    }

    _goNextPage = (pageName: string) => {
        const history = this.props.history;
        history.replace({ pathname: pageName });
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

export default Login;

