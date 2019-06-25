import React,{ Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import { reqWeather } from '../../api/index';
import MyButton from '../my-button/index';

import './index.less';
import {removeItem,getItem} from "../../utils/storage-tools";
import menuList from "../../config/menu-config";
const { confirm } = Modal;

class HeaderMain extends Component {
  state = {
    sysTime:Date.now(),
    weather:'晴',
    weatherImg:'http://api.map.baidu.com/images/weather/day/qing.png'
  };
  componentWillMount(){
    //只需读取一次
    this.username = getItem().username;
    this.title = this.getTitle(this.props);
  }
  async componentDidMount(){
   this.timeId = setInterval(() => {
      this.setState({
        sysTime:Date.now()});
    },1000);
    //发送天气请求，请求天气
    const { promise , cancel } = reqWeather();
    this.cancel =cancel;
    const result = await promise;
    if(result){
      this.setState(result);
    }
  }
  componentWillReceiveProps(nextProps){
    this.title = this.getTitle(nextProps);
  }
  componentWillUnmount(){
    //清除定时器
    clearInterval(this.timeId);
    //取消了ajax请求
    this.cancel();
  }
  logout=() => {
    confirm({
      title: '您确定要退出登录吗？',
      okText:'确认',
      cancelText:'取消',
      onOk:() => {
        //清空本地数据
        removeItem();
        //退出登录
        this.props.history.replace('/login');
      }
    });
  };
  getTitle = (nextProps) => {
    const { pathname } =nextProps.location;
    for (let i=0;i<menuList.length ;i++) {
      const menu = menuList[i];
      if(menu.children){
        for(let j=0 ;j<menu.children.length;j++){
          const item = menu.children[j];
          if(item.key === pathname){
            return item.title;
          }
        }
      }else{
        if(menu.key === pathname){
          return menu.title;
        }
      }
    }
  };
  render(){
    const { sysTime , weather , weatherImg } = this.state;
    return <div className="header-main">
      <div className="header-main-top">
        <span>欢迎，{this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg} alt=""/>
          <span>{weather}</span>
        </div>
      </div>
    </div>
  }
}
export default withRouter(HeaderMain);