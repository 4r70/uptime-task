import Head from "next/head";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import styles from "@/styles/Home.module.css";

import Parser from 'rss-parser';

const montserrat = Montserrat({ subsets: ["latin"] });


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
      <header className={`${styles.header} ${montserrat.className}`}>
        <h1>Lola v5</h1> <button>Your feeds</button>
      </header>
      <main className={`${styles.main} ${montserrat.className}`}>
        <div className={styles.headingRow}><h2 className={styles.title}>Your feed</h2><button className={styles.filterButton}>Filter</button></div>
        <div className={styles.articlesWrapper}>
          {data.map((item, index) => (
            <a className={styles.article} key={index} href={"#"}>
              <h3 className={styles.articleTitle}>{item.title}</h3> 
              {/* shorten the title if there is something that is too long, display on hover or smth */}
              <p className={styles.articleSnippet}>{item.contentSnippet}</p>
              <div className={styles.articleBottomRow}>
                <h5 className={styles.articleAuthor}>{item.author}</h5>
                <p className={styles.articleDate}>{new Date(item.isoDate).toLocaleDateString("en-GB")}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
