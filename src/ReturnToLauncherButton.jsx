import ArticlesButton from "./Button";

export default function ReturnToLauncherButton() {

    const urlParams = new URLSearchParams(window.location.search);
    const paramsObject = Object.fromEntries(urlParams)

    let { launcher_mode } = paramsObject

    launcher_mode = launcher_mode === '1' ? true : false

    // const router = useRouter()

    if (!launcher_mode) {
        return (
            <ArticlesButton
                // ref={el => elementsRef.current[6] = el}
                className={`w-100`}
                small
                style={{
                    zIndex: 10,
                    position: "relative",
                }}
                onClick={() => {
                    // window.history.back()
                    window.location.href = `https://games.articles.media`
                }}
            >
                <i className="fad fa-gamepad"></i>
                View our other games
            </ArticlesButton>
        )
    }

    return (
        <ArticlesButton
            // ref={el => elementsRef.current[6] = el}
            className={`w-100`}
            small
            style={{
                zIndex: 10,
                position: "relative",
            }}
            onClick={() => {
                // window.history.back()
                window.location.href = `https://games.articles.media`
            }}
        >
            <i className="fad fa-gamepad"></i>
            Return to Games
        </ArticlesButton>
    );
}   