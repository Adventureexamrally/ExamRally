
import { Helmet } from "react-helmet";
import Dashboard from "../components/Dashboard";
import Features from "../components/Features";

function Home() {
  return (
    <>
      <Helmet>
        <title>ExamRally – Best Online Test Series for Bank &amp; Government Exams</title>
        <meta name="description" content="ExamRally offers India's most accurate online test series for Bank PO, SBI PO, IBPS PO, Clerk &amp; government exams. Practice with full-length mock tests, PDF courses &amp; video courses." />
        <meta name="keywords" content="online test series, bank exam mock test, SBI PO 2025, IBPS PO, government exam preparation, ExamRally, bank exam course, free mock test" />
        <link rel="canonical" href="https://examrally.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ExamRally" />
        <meta property="og:url" content="https://examrally.in/" />
        <meta property="og:title" content="ExamRally – Best Online Test Series for Bank &amp; Government Exams" />
        <meta property="og:description" content="India's most accurate online test series for Bank PO, SBI PO, IBPS PO, Clerk &amp; government exams." />
        <meta property="og:image" content="https://examrally.in/web-app-manifest-512x512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ExamRally – Best Online Test Series for Bank &amp; Government Exams" />
        <meta name="twitter:description" content="India's most accurate online test series for Bank PO, SBI PO, IBPS PO, Clerk &amp; government exams." />
        <meta name="twitter:image" content="https://examrally.in/web-app-manifest-512x512.png" />
      </Helmet>
      <Dashboard />
      <Features />
    </>
  );
}
export default Home;
