import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLog = ({ items = 6, headerWidth = 560, headerHeight = 40, itemHeight = 400 }) => {
  return (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={headerHeight} width={headerWidth} />
      </div>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-12 mb-4">
          <Skeleton height={itemHeight} />
        </div>
      ))}
    </>
  );
};

export default SkeletonLog;
  