import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { getServerSideProps } from "next/dist/build/templates/pages";

const inter = Inter({ subsets: ["latin"] });

getServerSideProps = async (context) => {
  return {
    props: {
      data: "Hello World",
    },
  };
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Lolo v5</title>
        <meta name="description" content="Uptime exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        
      </main>
    </>
  );
}
