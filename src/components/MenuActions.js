import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";
import { mergePolygonClass } from "../utils/transformation";
import { olFeatures2Features, features2olFeatures } from "../utils/convert";
import { storeItems } from "./../store/indexedDB";

export const MenuActions = () => {
  const { items, dispatchSetItems } = useContext(MainContext);

  const setItems = useCallback(
    (items) => {
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: items,
      });
    },
    [dispatchSetItems]
  );

  const mergPolygons = () => {
    const features = olFeatures2Features(items);
    const mergedFeatures = mergePolygonClass(features);
    const mergedItems = features2olFeatures(mergedFeatures);
    setItems(mergedItems);
    // Save merged features in DB
    storeItems.deleteAllData();
    mergedFeatures.forEach((item) => {
      const id = `${item.properties.id}${item.properties.class}`;
      storeItems.addData({ ...item, id });
    });
  };

  document.addEventListener("keydown", (e) => {
    // Merge polygonos
    if (e.key === "m") {
      mergPolygons();
    }
  });
  return (
    <div>
      <div className="flex flex-row mt-3">
        <button
          className="custom_button"
          onClick={() => {
            mergPolygons();
          }}
        >
          Merge polygons (M)
        </button>
      </div>
    </div>
  );
};
