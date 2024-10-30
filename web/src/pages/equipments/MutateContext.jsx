
import React, { createContext, useContext } from 'react';

const MutateContext = createContext();

export const useFetchSpecificEquip = () => useContext(MutateContext);

export const MutateProvider = ({ children, mutate }) => {
  return <MutateContext.Provider value={mutate}>{children}</MutateContext.Provider>;
};
