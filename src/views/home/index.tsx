import { LinkedinFilled, MediumSquareFilled, TwitterOutlined } from "@ant-design/icons";
import { notification } from "antd";
import React, { useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";
import teamImgAlex from "../../assets/alex-migitko.png";
import clubImg2 from "../../assets/Classical Art.png";
import teamImgFilip from "../../assets/filip-egeric.jpeg";
import icHistory from "../../assets/ic_history.svg";
import icMusic from "../../assets/ic_music.svg";
import icVideo from "../../assets/ic_video.svg";
import descriptionImage1 from "../../assets/img1.png";
import descriptionImage2 from "../../assets/img2.png";
import teamImgJovan from "../../assets/jovan-ceperkovic.jpg";
import teamImgMartinK from "../../assets/martin-kardzhilov.png";
import teamImgMartinS from "../../assets/martin_simeonov.jpg";
import clubImg1 from "../../assets/Music4life.png";
import nLabel from "../../assets/n_label.svg";
import clubImg3 from "../../assets/Pax Pomana.png";
import teamImgPeter from "../../assets/peter-lozanov.png";
import qLabel from "../../assets/q_label.svg";
import showcaseImage from "../../assets/showcase.png";
import teamImgPlaceholder from "../../assets/team-placeholder.svg";
import footerLogo from "../../assets/UNQ-Club_logo.svg";
import teamImgUrosR from "../../assets/uros-radovanovic.png";
import teamImgUrosS from "../../assets/uros-sosevic.png";
import teamImgIvanB from "../../assets/ivan_bonchev.jpg";
import teamImgRadomir from "../../assets/radomir_basta.jpg";
import uLabel from "../../assets/u_label.svg";
import { OutlineButton } from "../../components/OutlineButton";
import { RaisedButton } from "../../components/RaisedButton";
import { useWallet } from "../../contexts/wallet";
import { http } from "../../data";
import "./style.less";

export const HomeView = () => {
  const [subscribeInput, setSubscribeInput] = useState("");
  const [privacyCheckbox, setPrivacyCheckbox] = useState(false);
  const { connected, connect } = useWallet();

  const subscribe = async () => {
    try {
      if (privacyCheckbox === false) {
        notification.warning({
          message: "To join the club please agree with our Data Protection & Privacy Policy.",
          placement: "bottomRight",
        });
        return;
      }

      const isSubscribeFieldValid = (
        document.getElementById("subscribe-field") as HTMLInputElement
      ).checkValidity();

      if (isSubscribeFieldValid === false) {
        notification.error({
          message: "Please enter valid email.",
          placement: "bottomRight",
        });
        return;
      }

      await http.post("mail", { email: subscribeInput });
      notification.success({
        message: "Successfully Subscribed!",
        placement: "bottomRight",
      });
      setSubscribeInput("");
      setPrivacyCheckbox(false);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Sorry, something went wrong. Please try again later.",
        placement: "bottomRight",
      });
    }
  };

  return (
    <main className="home-page">
      <section className="showcase">
        <div className="background-gradient"></div>
        <Fade triggerOnce delay={200}>
          <div className="showcase-wrapper">
            <div className="showcase-description">
              <h1>Discover, Collect, and Trade NFTs as a team.</h1>
              <p>
                The first DeFi platform providing tools for collectors and investors to power the
                NFT space. Running cross-chain, powered by{" "}
                <span className="gradient-underline">Solana</span>.
              </p>
              <OutlineButton onClick={connected ? () => {} : connect}>
                <span className="button-text">Discover</span>
              </OutlineButton>
            </div>
            <div className="showcase-image">
              <img src={showcaseImage} alt="alt-placeholder" />
              <p className="artwork">
                Artwork by <span>Martin Punchev</span>
              </p>
            </div>
          </div>
        </Fade>
      </section>

      <section className="description-section">
        <h2>
          We bring more togetherness to the <span className="strikethrough">NFT</span> space
        </h2>
        <Slide triggerOnce direction="right" duration={1300}>
          <div className="row reverse">
            <div className="description">
              <h3>Are you an experienced collector?</h3>
              <p>
                Create a <span className="gradient-underline">club, act as a curator</span>, raise
                funds to expand your collection, and build a community around it.
              </p>
              <ul>
                <li>Create clubs</li>
                <li>Raise funds through various DeFi mechanisms</li>
                <li>Buy and sell NFTs across all blockchains from a single interface</li>
                <li>Make collecting your full time job</li>
              </ul>
              <a
                href="https://unq.medium.com/clubs-explained-c531b065b09a"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RaisedButton>Read more</RaisedButton>
              </a>
            </div>
            <div className="image">
              <img src={descriptionImage1} alt="alt-placeholder" />
            </div>
          </div>
        </Slide>
        <Slide triggerOnce duration={1300}>
          <div className="row">
            <div className="image">
              <img src={descriptionImage2} alt="alt-placeholder" />
            </div>
            <div className="description">
              <h3>Or join an existing club</h3>
              <p>
                Help it, govern it, share the club’s collections and NFTs, and bring more social
                value for the club.
              </p>
              <ul>
                <li>Join multiple clubs</li>
                <li>Help them improve collections</li>
                <li>Promote your clubs and get rewards</li>
                <li>Share the results of your common efforts</li>
              </ul>
              <a
                href="https://drive.google.com/file/d/1-IbJew30IDv7dTnPtXly7PB-2Moep9tV/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RaisedButton>Watch a demo</RaisedButton>
              </a>
            </div>
          </div>
        </Slide>
      </section>

      <section className="about">
        <div className="background-gradient"></div>
        <div className="column left">
          <Slide triggerOnce>
            <h2>We provide the tools for the shared excitement of collecting</h2>
            <p>
              We are building a platform that enables artists, curators, and collectors to do their
              job in the new decentralized world.
            </p>
          </Slide>
        </div>
        <div className="column right">
          <Slide triggerOnce direction="right">
            <div className="list-item">
              <p>Clubs are DAOs, governed by the community, led by curators.</p>
              <div className="outline-button-wrapper">
                <OutlineButton>DAOs</OutlineButton>
              </div>
            </div>
            <div className="list-item">
              <p>
                Clubs can issue their own tokens that represent voting power and shares of the club.
              </p>
              <div className="outline-button-wrapper">
                <OutlineButton>
                  Club
                  <br />
                  tokens
                </OutlineButton>
              </div>
            </div>
            <div className="list-item">
              <p>Users can trade those tokens on the internal DEX.</p>
              <div className="outline-button-wrapper">
                <OutlineButton>DEX</OutlineButton>
              </div>
            </div>
            <div className="list-item">
              <p>
                Curators can raise money using DeFi mechanisms (liquidity pools) attached to the
                club.
              </p>
              <div className="outline-button-wrapper">
                <OutlineButton>DeFi</OutlineButton>
              </div>
            </div>
            <div className="list-item">
              <p>
                Curators can buy and sell NFTs across multiple blockchains from a single interface.
              </p>
              <div className="outline-button-wrapper">
                <OutlineButton>
                  Cross
                  <br />
                  Chain
                </OutlineButton>
              </div>
            </div>
          </Slide>
        </div>
      </section>

      <Fade triggerOnce duration={2000}>
        <section className="clubs">
          <div className="title">
            <h2 className="strikethrough">Top clubs</h2>
            <h3>of the week</h3>
          </div>
          <div className="club-items">
            <div className="club-item">
              <div className="club-header">
                <img src={uLabel} alt="alt-placeholder" />
                <h4>Music4life</h4>
              </div>
              <div className="chips">
                <span className="chip">music</span>
                <span className="chip">celebrities</span>
                <span className="chip">memorabilia</span>
                <div className="more">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="image-wrapper">
                <img className="image" src={clubImg1} alt="alt-placeholder" />
                <div className="image-hover image-hover-u"></div>
              </div>
              <div className="club-stats">
                <div>
                  <h5>Members</h5>
                  <h4>15.6k</h4>
                </div>
                <div>
                  <h5>Valuation</h5>
                  <h4>$5.4M</h4>
                </div>
              </div>
            </div>

            <div className="club-item">
              <div className="club-header">
                <img src={nLabel} alt="alt-placeholder" />
                <h4>Classical Art</h4>
              </div>
              <div className="chips">
                <span className="chip">paintings</span>
                <span className="chip">antiques</span>
                <span className="chip">history</span>
                <div className="more">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="image-wrapper">
                <img className="image" src={clubImg2} alt="alt-placeholder" />
                <div className="image-hover image-hover-n"></div>
              </div>
              <div className="club-stats">
                <div>
                  <h5>Members</h5>
                  <h4>1,622</h4>
                </div>
                <div>
                  <h5>Valuation</h5>
                  <h4>$55.4M</h4>
                </div>
              </div>
            </div>

            <div className="club-item">
              <div className="club-header">
                <img src={qLabel} alt="alt-placeholder" />
                <h4>Pax Romana Gallery</h4>
              </div>
              <div className="chips">
                <span className="chip">books</span>
                <span className="chip">arts</span>
                <span className="chip">memorabilia</span>
                <div className="more">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="image-wrapper">
                <img className="image" src={clubImg3} alt="alt-placeholder" />
                <div className="image-hover image-hover-q"></div>
              </div>
              <div className="club-stats">
                <div>
                  <h5>Members</h5>
                  <h4>31</h4>
                </div>
                <div>
                  <h5>Valuation</h5>
                  <h4>$10,266</h4>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fade>

      <Fade triggerOnce duration={2000}>
        <section className="deals">
          <div className="deals-list">
            <div className="deal-item">
              <h3>Happy Moments from Greece Vol. 18 Happy Moments from Greece</h3>
              <img className="image dealImg1" alt="alt-placeholder" />
              <div className="info">
                <div className="edition">
                  <h4>Edition</h4>
                  <span>34/100</span>
                </div>
                <div className="type">
                  <h4>Object Type</h4>
                  <img className="type-icon" src={icVideo} alt="alt-placeholder" />
                </div>
              </div>
            </div>

            <div className="deal-item">
              <h3>Dj X experimental</h3>
              <img className="image dealImg2" alt="alt-placeholder" />
              <div className="info">
                <div className="edition">
                  <h4>Edition</h4>
                  <span>3/25</span>
                </div>
                <div className="type">
                  <h4>Object Type</h4>
                  <img className="type-icon" src={icMusic} alt="alt-placeholder" />
                </div>
              </div>
            </div>

            <div className="deal-item">
              <h3>Crusaders Gold Ring With Templar Cross</h3>
              <img className="image dealImg3" alt="alt-placeholder" />
              <div className="info">
                <div className="edition">
                  <h4>Edition</h4>
                  <span>UNQ</span>
                </div>
                <div className="type">
                  <h4>Object Type</h4>
                  <img className="type-icon" src={icHistory} alt="alt-placeholder" />
                </div>
              </div>
            </div>
          </div>
          <div className="title">
            <h2 className="strikethrough">Hot deals</h2>
            <h3>of the day</h3>
          </div>
        </section>
      </Fade>

      <section className="blockchain">
        <Slide triggerOnce>
          <div className="left-column">
            <h2>
              Being a collector is easy? <span>Buying a fake</span>, too.
            </h2>
            <p>
              There is a person behind every piece of art, a story behind every collection, and an
              inspiration, emotions and incentives behind every trade.
            </p>
            <p>
              But this traditional industry hides plenty of threats and weaknesses - from the high
              barriers to entry, fraud, and legal restrictions, to the lack of liquidity for both
              artists and collectors.
            </p>
          </div>
        </Slide>
        <Slide triggerOnce direction="right">
          <div className="right-column">
            <h2>
              <span>Blockchain</span> = unbiased protection and efficiency
            </h2>
            <p>
              Blockchain provides Trust, Transparency, and Efficiency for the art and collective
              ecosystem.
            </p>
            <p>
              The NFTs are changing the way artists create, verify,promote, trade & earn, and fund
              their collectibles.
            </p>
            <a
              href="https://unq.medium.com/lets-get-technical-fd4f01b8fa5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RaisedButton>HOW WE DO IT?</RaisedButton>
            </a>
          </div>
        </Slide>
      </section>

      <section className="subscribe">
        <h2>
          UNQ.club unveils the missing ingredient - we help humans to interact with technology and
          to reproduce the positive and get rid of the negative aspects of the industry.
        </h2>

        <div className="subscribe-input-wrapper">
          <div className="subscribe-input">
            <input
              id="subscribe-field"
              value={subscribeInput}
              onChange={(e) => setSubscribeInput((e.target as HTMLInputElement).value)}
              type="email"
              placeholder="Be the first to join the club"
              required
            />
            <RaisedButton onClick={subscribe}>Notify me</RaisedButton>
          </div>

          <div className="privacy-policy">
            <input
              type="checkbox"
              checked={privacyCheckbox}
              onChange={() => setPrivacyCheckbox(!privacyCheckbox)}
            ></input>
            <span>I agree with Data Protection & Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="team">
        <h2 className="strikethrough">Team</h2>

        <div className="team-members">
          <Fade triggerOnce cascade duration={600} damping={0.15}>
            <div className="member">
              <img src={teamImgAlex} alt="alt-placeholder" />
              <h4>Alex Migitko</h4>
              <h5>Co-Founder, CEO</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/amigitko/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgPeter} alt="alt-placeholder" />
              <h4>Peter Lozanov</h4>
              <h5>Co-Founder, CPO</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/peterlozanov/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgUrosS} alt="alt-placeholder" />
              <h4>Uros Sosevic</h4>
              <h5>CTO</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/urossosevic/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgMartinK} alt="alt-placeholder" />
              <h4>Martin Kardzhilov</h4>
              <h5>Business Development</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/asd-91482b1a2/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgMartinS} alt="alt-placeholder" />
              <h4>Martin Simeonov</h4>
              <h5>UX/UI Designer</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/msimeonov/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgFilip} alt="alt-placeholder" />
              <h4>Filip Egeric</h4>
              <h5>Developer</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/filipegeric/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgJovan} alt="alt-placeholder" />
              <h4>Jovan Ceperkovic</h4>
              <h5>Developer</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/jovan-ceperkovic/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgUrosR} alt="alt-placeholder" />
              <h4>Uros Radovanovic</h4>
              <h5>Ethereum Implementation Advisor</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/uros-radovanovic/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgIvanB} alt="alt-placeholder" />
              <h4>Dr. Ivan Bonchev, PhD</h4>
              <h5>Art & Artifacts Advisor</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/dr-ivan-bonchev-a33953199/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>

            <div className="member">
              <img src={teamImgRadomir} alt="alt-placeholder" />
              <h4>Radomir Basta</h4>
              <h5>Marketing Advisor</h5>
              <div className="icons">
                <a href="https://www.linkedin.com/in/radomirbasta/" target="_blank">
                  <LinkedinFilled />
                </a>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      <footer className="footer">
        <div className="policy">
          <p>© All Rights Reserved</p>
        </div>
        <div className="logo">
          <img src={footerLogo} alt="alt-placeholder" />
        </div>
        <div className="social">
          <div className="icons">
            <a href="https://twitter.com/ClubUnq" target="_blank">
              <TwitterOutlined />
            </a>
            <a href="https://medium.com/@unq" target="_blank">
              <MediumSquareFilled />
            </a>
            <a href="https://t.me/unq_club" target="_blank">
              <span>
                <i className="fab fa-telegram"></i>
              </span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};
