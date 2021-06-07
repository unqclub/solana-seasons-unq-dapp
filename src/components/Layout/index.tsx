import "./../../App.less";

import { Layout } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/header_logo.svg";
import { AppBar } from "../AppBar";

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <div className="App">
      <Layout>
        <Header className="App-Bar">
          <Link to="/" className="app-title-wrapper">
            <div className="app-title">
              <img src={logo} alt="UNQ" />
            </div>
          </Link>
          <AppBar />
        </Header>
        <div className="header-message">
          <p>
            Please be aware that this is a demo version, and some features might not work as
            expected.
          </p>
        </div>
        <Content>{props.children}</Content>
      </Layout>
    </div>
  );
});
