import React from "react";
import styled from "styled-components";
import pkg from "../../package.json";
import { SocialIcon } from 'react-social-icons';

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 24px 0 16px 0;
  background: #007523ff;
  color: #000; // changed to black
  text-align: center;
  font-size: 16px;
  margin-top: 40px;
`;

const SocialLinks = styled.div`
  margin-bottom: 8px;
  a {
    margin: 0 10px;
    color: #000;
    text-decoration: none;
    font-size: 20px;
    transition: color 0.2s;
    &:hover {
      color: #ffffffff; // orange on hover
    }
  }
`

export default function Footer() {
  return (
    <FooterWrapper>
      <SocialLinks>
        <SocialIcon url="#" network="twitter" bgColor="#ffffffff" fgColor="#000000ff" style={{ height: 32, width: 32, margin: "0 10px" }} label="Twitter Community" />
        <SocialIcon url="#" network="discord" bgColor="#ffffffff" fgColor="#000000ff" style={{ height: 32, width: 32, margin: "0 10px" }} label="Discord" />
        <SocialIcon url="#" network="github" bgColor="#ffffffff" fgColor="#000000ff" style={{ height: 32, width: 32, margin: "0 10px" }} label="GitHub" />
      </SocialLinks>
      <div>
        © {new Date().getFullYear()} BETS. All rights reserved.
      </div>
      <div style={{ fontSize: "15px", marginTop: "4px" }}>
        Version: <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#000", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#000")}
        >
          {pkg.version}
        </a>
      </div>
    </FooterWrapper>
  );
}