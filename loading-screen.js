window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const minLoadingTime = 1000; // 4 secondes en ms
  const startTime = performance.now();

  const hideLoading = () => {
    loadingScreen.style.display = 'none';
  };

  const elapsed = performance.now() - startTime;
  const remainingTime = minLoadingTime - elapsed;

  if (remainingTime > 0) {
    setTimeout(hideLoading, remainingTime);
  } else {
    hideLoading();
  }
});