import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import Parser from 'rss-parser';

const inter = Inter({ subsets: ["latin"] });


export async function getServerSideProps() {
  // const response = await fetch("https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss")
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
        data: {  },
        error: "Error fetching data",
      },
    };

  }
}

export default function Home({ data, error }) {
  // console.log(data)
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
      <main className={`${styles.main} ${inter.className}`}>
        {data.map((item, index) => (
          <div key={index}>
            <h1>{item.title}</h1>
            <p>{item.contentSnippet}</p>
            <p>{item.isoDate}</p>
          </div>
        ))}
      </main>
    </>
  );
}
