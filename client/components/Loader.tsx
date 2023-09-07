import React from "react";
import { ThreeCircles } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 ">
      <ThreeCircles
        height="80"
        width="80"
        color="#9333db"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
      />
    </div>
  );
};

export default Loader;
