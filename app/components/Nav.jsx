'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const Nav = () => {
  const openNav = () => {
    document.body.classList += "menu__open";
  };

  const closeNav = () => {
    document.body.classList.remove("menu__open");
  };

  return (
    <header className="transparent header-light scroll-light smaller">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10">
              <div className="de-flex-col">
                <div className="de-flex-col">
                  <div id="logo">
                    <Link href="/">
                      <Image alt="" className="logo-2" src="/images/Ultraverse.png" width={150} height={50} />
                    </Link>
                  </div>
                </div>
                <div className="de-flex-col">
                  <input
                    id="quick_search"
                    className="xs-hide"
                    name="quick_search"
                    placeholder="search item here..."
                    type="text"
                  />
                </div>
              </div>
              <div className="de-flex-col header-col-mid">
                <ul id="mainmenu">
                  <li className="menu-item-has-children has-child">
                    <Link href="/">
                      Home<span></span>
                    </Link>
                  </li>
                  <li className="menu-item-has-children has-child">
                    <Link href="/explore">
                      Explore<span></span>
                    </Link>
                  </li>
                  <li>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="btn-main connect-wallet">
                          Sign In
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10",
                            userButtonPopoverCard: "shadow-lg"
                          }
                        }}
                      />
                    </SignedIn>
                  </li>
                </ul>

                <div className="menu_side_area">
                  <span onClick={() => openNav()} id="menu-btn"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul id="dropdown__wrapper">
        <li className="dropdown__list">
          <Link href="/" onClick={() => closeNav()}>
            Home
          </Link>
        </li>
        <li className="dropdown__list">
          <Link href="/explore" onClick={() => closeNav()}>
            Explore
          </Link>
        </li>
        <li className="dropdown__list">
          <SignedOut>
            <SignInButton mode="modal">
              <button onClick={() => closeNav()} className="btn-main" style={{ margin: '10px 0', width: '100%' }}>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div onClick={() => closeNav()}>
              <UserButton />
            </div>
          </SignedIn>
        </li>
        <li className="close__button">
          <button onClick={() => closeNav()}>
            <FaTimes />
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Nav;
