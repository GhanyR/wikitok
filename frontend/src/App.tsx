import { useEffect, useRef, useCallback, useState } from "react";
import { useWikiArticles } from "./hooks/useWikiArticles";
import { Analytics } from "@vercel/analytics/react";
import Loader from "./components/ui/loader";
import "./components/ui/ui.scss";
import { WikiCard } from "./components/ui/wikicard";
import Header from "./components/ui/header";
import { LanguageSelector } from "./components/ui/language-selector";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const { articles, loading, fetchArticles } = useWikiArticles();
  const observerTarget = useRef(null);
  const rootRef = useRef(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading && articles.length > 0) {
        fetchArticles();
      }
    },
    [loading, fetchArticles]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
      root: rootRef.current,
      rootMargin: "200%",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div
      className="h-screen w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory"
      ref={rootRef}
    >
      <Header showAbout={showAbout} setShowAbout={setShowAbout} />
      {showAbout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md relative">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">About WikiTok</h2>
            <p className="mb-4">
              A TikTok-style interface for exploring random Wikipedia articles.
            </p>
            <p className="text-white/70">
              Made with ❤️ by{" "}
              <a
                href="https://x.com/Aizkmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                @Aizkmusic
              </a>
            </p>
            <p className="text-white/70 mt-2">
              Check out the code on{" "}
              <a
                href="https://github.com/IsaacGemal/wikitok"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      )}
      {articles.map((article) => (
        <WikiCard key={article.pageid} article={article} />
      ))}
      <Loader
        loading={loading}
        ref={observerTarget}
        progressive={articles.length > 0}
      />
      <Analytics />
    </div>
  );
}

export default App;
