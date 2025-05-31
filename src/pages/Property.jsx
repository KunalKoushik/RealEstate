import React, { useState } from "react";
import ListProperty from "../components/property/ListProperty";
import ShowProperty from "../components/property/ShowProperty";

const Property = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="w-full mt-20 flex flex-col items-center justify-center">
      
        <div className="flex p-2  items-center justifycenter w-[94%] mb-10  ">
          <button
            className="rounded-md p-2 shadow-lg absolute right-[3rem] shadow-blue-500 bg-blue-200 "
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? "Sell your Property" : "All Properties"}
          </button>
          <h1 data-aos="zoom-in" className=" justify-self-center text-4xl  font-semibold">
            Latest Properties
          </h1>
        </div>
      
      {/* all properties */}
      {/* create property */}
      {show ? <ShowProperty /> : <ListProperty />}
    </div>
  );
};

export default Property;
