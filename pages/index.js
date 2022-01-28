import Head from "next/head";
import styles from "../styles/Home.module.css";
import GridRenderer from "../components/GridRenderer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pathfinding Visualiser</title>
        <meta name="description" content="Next.JS based Graphing Calculator." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <GridRenderer />
      </main>
    </div>
  );
}
