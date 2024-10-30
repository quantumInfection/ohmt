const TokenManager = (() => {
  let token = null;

  return {
    setToken: (newToken) => {
      token = newToken;
    },
    getToken: () => token,
  };
})();

export default TokenManager;
