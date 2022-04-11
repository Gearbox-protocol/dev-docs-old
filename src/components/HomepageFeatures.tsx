import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
  url: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Gearbox Concepts",
    image: "/images/gearbox_man.png",
    url: "docs/documentation/intro",
    description: (
      <>
        Learn about the core concepts of Gearbox, its definitions, smart
        contracts and parameters
      </>
    ),
  },
  {
    title: "Learn from our tutorials",
    image: "/images/gearbox_contracts.png",
    url: "docs/tutorials/intro",
    description: (
      <>
        Get from zero to hero by setting up a local development environment with
        our step by step tutorials
      </>
    ),
  },
  {
    title: "Discover our SDK",
    image: "/images/gearbox_men.png",
    url: "docs/sdk/intro",
    description: (
      <>
        Dive into our SDK and learn how it can accelerate your dApp development
      </>
    ),
  },
];

function Feature({ title, image, description, url }: FeatureItem) {
  return (
    <div className={styles.cardListItem}>
      <section className={styles.cardWrapper}>
        <div className={styles.card}>
          <Link to={url} className="navbar__link">
            <div className="text--center">
              <img
                className={styles.featureSvg}
                alt={title}
                src={useBaseUrl(image)}
              />
            </div>
            <div className="text--center padding-horiz--md">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className={styles.cardList}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
