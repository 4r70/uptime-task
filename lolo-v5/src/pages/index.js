import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import { parseString } from 'xml2js';

const inter = Inter({ subsets: ["latin"] });

async function parseXML(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getServerSideProps() {
  const response = await fetch("https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss")
  const xml = await response.text();
  const data = await parseXML(xml);
  // const parser = await fetch("https://uptime-mercury-api.azurewebsites.net/webparser", { method: "POST", body: content })
  console.log(data)
  return {
    props: {
      data: { data },
    },
  };
}

export default function Home({ parser }) {
  return (
    <>
      <Head>
        <title>Lolo v5</title>
        <meta name="description" content="Uptime exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
      {/* <p>{parser}</p> */}
      </main>
    </>
  );
}
