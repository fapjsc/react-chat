import './App.css';
import { w3cwebsocket as W3CWebsocket } from 'websocket';
import React from 'react';

import { Card, Avatar, Input, Typography, message } from 'antd';
import 'antd/dist/antd.css';
const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new W3CWebsocket('ws://192.168.11.128:8000');

class App extends React.Component {
  state = {
    userName: '',
    isLoggedIn: false,
    messages: [],
  };

  componentDidMount() {
    // 1.建立連接
    client.onopen = () => {
      console.log('websocket client connected');
    };

    // 3.收到server回復
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer);

      console.log(this.state.messages, 'server reply');

      if (dataFromServer.type === 'message') {
        this.setState(state => ({
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.msg,
              user: dataFromServer.user,
            },
          ],
        }));
      }
    };
  }

  // 2.點擊後發送訊息到server
  buttonClick = message => {
    // send message to server
    client.send(
      JSON.stringify({
        type: 'message',
        msg: message,
        user: this.state.userName,
      })
    );

    this.setState({
      searchVal: '',
    });
  };

  render() {
    console.log(this.state.messages, 'render');
    return (
      <div className="main">
        {this.state.isLogin ? (
          <div>
            {/* title */}
            <div className="title">
              <Text type="secondary" style={{ fontSize: '36px' }}>
                Web Chat
              </Text>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: 50,
              }}
            >
              {this.state.messages.map(message => (
                <Card
                  key={message.msg}
                  style={{
                    width: 300,
                    margin: '16px 4px 0 4px',
                    backgroundColor:
                      this.state.userName === message.user ? 'red' : 'blue',
                    alignSelf:
                      this.state.userName === message.user
                        ? 'flex-end'
                        : 'flex-start',
                  }}
                  loading={false}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ color: 'red', backgroundColor: '#fde3cf' }}
                      >
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={message.user + ':'}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>

            {/* 輸入訊息 */}
            <div className="bottom">
              <Search
                placeholder="input message and send"
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={e => this.setState({ searchVal: e.target.value })}
                onSearch={value => this.buttonClick(value)}
              />
            </div>

            {/* <button onClick={() => this.buttonClick('hi')}>send message</button>
            {this.state.messages.map((msg, index) => (
              <p key={index}>
                message: {msg.msg}, user: {msg.user}
              </p>
            ))} */}
          </div>
        ) : (
          <div style={{ padding: '200px 40px' }}>
            <Search
              placeholder="請輸入名稱"
              enterButton="Login"
              size="large"
              onSearch={value =>
                this.setState({ isLogin: true, userName: value })
              }
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
