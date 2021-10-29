import React, { Component } from 'react';
import './Login.less';
import request from '../../utils/Http';
import { Input ,Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

type Props = {
    history: Object,
};

class Login extends Component<Props, State> {



    state = {
        loading: false,
    }


    componentWillMount() {

    }

    componentDidMount() {
        document.title = "摸鱼派登录";
        if (document.body !== null) {
            document.body.style.backgroundColor = '#FFFFFF';
        }
        let userCookie = window.cookie.get('shopId');
        if (userCookie !== undefined && userCookie !== null && userCookie !== 'undefined' && userCookie.length > 0) {
            this.props.history.replace({ pathname: 'home' });
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
                    <Input disabled="this.state.loading" className="inputItem" size="large" placeholder="用户名" prefix={<UserOutlined />} />
                    <Input.Password disabled="this.state.loading" className="inputItem" size="large" placeholder="密码" prefix={<LockOutlined />} />

                    <Button type="primary" loading="this.state.loading" className="loginBtn">
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
            this._showAlert('请输入账号');
        } else if (this.pwd.length === 0) {
            this._showAlert('请输入密码');
        } else {
            formIsOk = true;
        }
        return formIsOk;
    }

    _loginRequest = () => {
        if (!this.doing) {
            this.doing = true;
            this._showModal();

            let postData = {
                login: this.account,
                pwd: this.pwd
            }

            // request('api/web/shop/login', postData)
            //     .then((data) => {
            //         this.doing = false;
            //         this._hiddenModal();
            //         if (data.code === 0) {
            //             window.cookie.set('shopId', data.data.id);
            //             this._goNextPage('home');
            //         } else {
            //             this._showToast(data.msg);
            //         }
            //     }).catch((error) => {
            //         this.doing = false;
            //         this._hiddenModal();
            //         this._failToast();
            //     });
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

