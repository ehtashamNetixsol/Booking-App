import React from "react";

const PageHeader = ({ heading = "", link = "" }) => {
  return (
    <div className="h-auto mb-10">
      <h1 className="font-semibold text-xl sm:text-4xl text-center">
        {heading}
      </h1>
      <p className="opacity-80 text-[14px] sm:text-xl my-2 text-center">
        {link}
      </p>
    </div>
  );
};

export default PageHeader;
