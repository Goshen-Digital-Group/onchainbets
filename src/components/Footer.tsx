import React from "react";
import styled from "styled-components";
import pkg from "../../package.json";
import logo from "/logo.svg";
import { SocialIcon } from "react-social-icons";

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 8px 0 6px 0;
  background: #007523ff;
  color: #000; // changed to black
  text-align: center;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    font-size: 12px;
    padding: 6px 0 4px 0;
  }
  margin-top: 0;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 160px;
  margin-left: auto;
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  a {
    margin: 0 10px;
    color: #000;
    text-decoration: none;
    font-size: 20px;
    transition: color 0.2s;
    &:hover {
      color: #ffffffff;
    }
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  height: 48px;
  margin-right: 10px;
`;

const VersionSection = styled.div`
  font-size: 12px;
  background: rgba(0, 139, 0, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  margin-top: 2px;
  @media (max-width: 600px) {
    font-size: 11px;
    padding: 2px 6px;
    text-align: right;
  }
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <LeftSection>
        <LogoImg src={logo} alt="onchainbets logo" />
        <span style={{ fontWeight: "bold", color: "#fff" }}>
          © {new Date().getFullYear()} BETS. All rights reserved.
        </span>
      </LeftSection>
      <RightSection>
        <SocialLinks>
          <SocialIcon
            url="https://x.com/Onchainbetsfun"
            network="twitter"
            bgColor="#ffffffff"
            fgColor="#000000ff"
            style={{ height: 28, width: 28, margin: "0 10px" }}
            label="Twitter Community"
          />
          {/*
          <SocialIcon
            url="#"
            network="discord"
            bgColor="#ffffffff"
            fgColor="#000000ff"
            style={{ height: 28, width: 28, margin: "0 10px" }}
            label="Discord"
          />
          */}
          <SocialIcon
            url="https://github.com/Goshen-Digital-Group/onchainbets"
            network="github"
            bgColor="#ffffffff"
            fgColor="#000000ff"
            style={{ height: 28, width: 28, margin: "0 10px" }}
            label="GitHub"
          />
        </SocialLinks>
        <VersionSection style={{ fontWeight: "bold", color: "#fff" }}>
          Version:{" "}
          <a
            href="https://github.com/Goshen-Digital-Group/onchainbets"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            {pkg.version}
          </a>
        </VersionSection>
      </RightSection>
    </FooterWrapper>
  );
}
