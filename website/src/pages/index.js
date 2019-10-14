/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>The Problem</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Despite all the recent hype, setting up a new TypeScript (x React)
        library can be tough. Between Rollup, Jest, tsconfig, Yarn resolutions,
        TSLint, and getting VSCode to play nicely....there is just a whole lot
        of stuff to do (and things to screw up).
      </>
    ),
  },
  {
    title: <>Zero Config</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        TSDX is a zero-config CLI that helps you develop, test, and publish
        modern TypeScript packages with ease--so you can focus on your awesome
        new library and not waste another afternoon on the configuration.
      </>
    ),
  },
  {
    title: <>Batteries Included</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <ul>
        <li>
          Bundles your code with{' '}
          <a href="https://github.com/rollup/rollup">Rollup</a> and outputs
          multiple module formats (CJS &amp; ESM by default, and also UMD if you
          want) plus development and production builds
        </li>
        <li>
          Comes with treeshaking, ready-to-rock lodash optimizations, and
          minification/compression
        </li>
        <li>Live reload / watch-mode</li>
        <li>Works with React</li>
        <li>Human readable error messages (and in VSCode-friendly format)</li>
        <li>Bundle size snapshots</li>
        <li>
          Opt-in to extract <code>invariant</code> error codes
        </li>
        <li>
          Jest test runner setup with sensible defaults via{' '}
          <code>tsdx test</code>
        </li>
        <li>Zero-config, single dependency</li>
      </ul>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={classnames('hero hero--secondary', styles.heroBanner)}>
        <div className="container">
          <svg
            width={531 / 2}
            height={313 / 2}
            viewBox="0 0 531 313"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 152.5V305H152.5H305V152.5V0H152.5H0V152.5Z"
              fill="#007ACC"
            />
            <path
              d="M67.4469 153.512L67.35 166.002H87.1992H107.048L107.048 222.403V278.804H121.088H135.128V222.403V166.002H154.977H174.826L174.826 153.754C174.826 146.976 174.681 141.312 174.487 141.166C174.342 140.973 150.184 140.876 120.894 140.924L67.5921 141.07L67.4469 153.512Z"
              fill="white"
            />
            <path
              d="M246.105 140.715C253.851 142.652 259.757 146.089 265.179 151.705C267.987 154.706 272.151 160.177 272.49 161.484C272.587 161.871 259.321 170.779 251.285 175.766C250.994 175.959 249.833 174.701 248.525 172.764C244.604 167.052 240.489 164.582 234.195 164.147C224.948 163.517 218.994 168.359 219.042 176.444C219.042 178.816 219.381 180.22 220.349 182.156C222.383 186.368 226.159 188.886 238.02 194.017C259.854 203.409 269.198 209.606 275.007 218.417C281.494 228.245 282.947 243.931 278.541 255.598C273.7 268.282 261.694 276.9 244.798 279.756C239.569 280.676 227.175 280.531 221.56 279.514C209.311 277.336 197.692 271.284 190.527 263.344C187.719 260.246 182.248 252.161 182.587 251.58C182.733 251.386 183.991 250.612 185.395 249.789C186.751 249.014 191.883 246.061 196.724 243.253L205.487 238.17L207.326 240.881C209.892 244.802 215.508 250.176 218.897 251.967C228.628 257.099 241.99 256.373 248.574 250.467C251.382 247.901 252.544 245.238 252.544 241.317C252.544 237.782 252.108 236.233 250.268 233.571C247.896 230.182 243.055 227.325 229.306 221.371C213.571 214.593 206.794 210.381 200.597 203.7C197.014 199.827 193.625 193.63 192.221 188.45C191.06 184.141 190.769 173.345 191.689 168.988C194.933 153.786 206.406 143.184 222.964 140.037C228.337 139.021 240.828 139.408 246.105 140.715Z"
              fill="white"
            />
            <path
              d="M366.52 254.2C361.88 254.2 358.2 250.2 358.2 240.12C358.2 223.96 368.12 202.84 378.52 202.84C381.4 202.84 386.36 203.64 391.8 205.4L384.28 244.44C378.04 250.04 371.16 254.2 366.52 254.2ZM421.56 266.52L419.8 254.68C406.52 257.56 405.88 257.4 407.16 250.52L426.68 149.56L402.36 151.32L396.28 182.84C394.04 182.52 391.96 182.52 390.04 182.52C354.84 182.52 333.56 215.64 333.56 247.48C333.56 267.48 342.36 277.24 352.92 277.24C362.2 277.24 373.24 269.72 382.84 260.28C382.04 278.2 390.84 283.8 421.56 266.52ZM485.72 275.32L513.24 274.52L492.76 230.04L530.2 184.92H504.28L481.4 215.48L468.76 184.6L441.24 185.56L461.4 229.88L423.96 275H450.04L472.92 244.44L485.72 275.32Z"
              fill="black"
            />
          </svg>
          {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--primary button--lg',
                styles.getStarted
              )}
              style={{ marginRight: '1rem' }}
              to={withBaseUrl('docs/starthere')}
            >
              Get Started
            </Link>
            <Link
              className={classnames(
                'button  button--secondary button--lg',
                styles.getStarted
              )}
              to={'https://github.com/palmerhq/tsdx'}
            >
              GitHub
            </Link>
          </div>
          <pre
            style={{
              textAlign: 'left',
              margin: '0 auto',
              marginTop: 10,
              maxWidth: 450,
            }}
          >
            {`npx tsdx create mylib
cd mylib && yarn start`}
          </pre>
        </div>{' '}
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({ imageUrl, title, description }, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--4', styles.feature)}
                  >
                    {imageUrl && (
                      <div className="text--center">
                        <img
                          className={styles.featureImage}
                          src={withBaseUrl(imageUrl)}
                          alt={title}
                        />
                      </div>
                    )}
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
