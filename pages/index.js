import styles from "./styles/Home.module.css";

function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Minha querida,
                </h1>

                <p className={styles.description}>
                    Desde que te conheci, meu coração não foi mais o mesmo. Você me preenche com alegria e amor a cada
                    dia. Seu sorriso ilumina a minha vida e seu carinho me faz sentir completo. Eu amo você mais do que
                    as palavras podem expressar. Obrigado por ser você.
                </p>
            </main>
        </div>
    );
}

export default Home;