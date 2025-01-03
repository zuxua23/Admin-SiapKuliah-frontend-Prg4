import { lazy } from "react";

const Beranda = lazy(() => import("../page/beranda/Root"));

const Pemain = lazy(() =>
  import("../page/pemain/Root")
);
const Quiz = lazy(() =>
  import("../page/quiz/Root")
);
const TebakGambar = lazy(() =>
  import("../page/tebak-gambar/Root")
);
const Puzzle = lazy(() =>
import("../page/puzzle/Root")
);
const FeedBack = lazy(() =>
import("../page/feedback/Root")
);

const routeList = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/pemain",
    element: <Pemain />,
  },
  {
    path: "/feedback",
    element: <FeedBack />,
  },
  {
    path: "/quiz",
    element: <Quiz />,
  },
     {
    path: "/tebak_gambar",
    element: <TebakGambar />,
  },
       {
    path: "/puzzle",
    element: <Puzzle />,
  },
  
];

export default routeList;
