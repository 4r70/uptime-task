import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import Parser from 'rss-parser';

const inter = Inter({ subsets: ["latin"] });


export async function getServerSideProps() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');
    const data = feed.items;

    return {
      props: {
        data,
      },
    };

  } catch (error) {

    return {
      props: {
        data: {},
        error: "Error fetching data: " + error,
      },
    };

  }
}

export default function Home({ data, error }) {
  console.log(data)
  if (error) {
    console.log(error)
  }
  return (
    <>
      <Head>
        <title>Lolo v5</title>
        <meta name="description" content="Uptime exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.bg}></div>
      <header className={`${styles.header} ${inter.className}`}>
        <h1>Lola v5</h1> <button>Your feeds</button>
      </header>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.articlesWrapper}>
        {data.map((item, index) => (
          <a className={styles.article} key={index} href={"#"}>
            <h3>{item.title}</h3>
            <h4>{item.author}</h4>
            <p>{item.contentSnippet}</p>
            <p>{new Date(item.isoDate).toLocaleDateString("en-GB")}</p>
          </a>
        ))}
        </div>
      </main>
    </>
  );
}
